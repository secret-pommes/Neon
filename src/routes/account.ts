import { Hono } from "hono";
import { z } from "zod";

import error from "../utils/error";
import utils from "../utils/utils";
import account from "../model/account";
import token from "../utils/token";
import {
  ClientTokenT,
  AccessTokenT,
  AccountT,
  RefreshTokenT,
} from "../types/types";

export default class Account {
  public route(app: Hono): void {
    app.all("/api/oauth/token", async (c) => {
      if (c.req.method !== "POST") return error.method(c);
      const body = await c.req.parseBody({ all: true });
      const header = c.req.header();

      const bodyObj = z.object({
        grant_type: z.enum(["client_credentials", "password", "refresh_token"]),
        username: z.string().optional(),
        password: z.string().optional(),
        refresh_token: z.string().optional(),
        exchange_code: z.string().optional(),
        external_auth_type: z.string().optional(),
        external_auth_token: z.string().optional(),
      });
      const headerObj = z.object({
        authorization: z.string(),
        "user-agent": z.string(),
        "x-epic-correlation-id": z.string(),
        "x-real-ip": z.string().optional(),
        host: z.string(),
      });

      const bodyRes = bodyObj.safeParse(body);
      const headerRes = headerObj.safeParse(header);

      if (!bodyRes.success || !headerRes.success) return error.validation(c);
      const clientId = utils
        .decodeBase64(headerRes.data.authorization.split(" ")[1])
        .split(":")[0];

      if (!clientId) return error.invalidClient(c, "account");

      let Account: AccountT | null = null;
      const ip: string =
        headerRes.data["x-real-ip"] || headerRes.data.host.split(":")[0];

      switch (bodyRes.data.grant_type) {
        case "client_credentials": {
          let cToken = await token.getClientToken(ip);
          if (c) await token.deleteClientToken(ip);
          cToken = token.createClientToken(
            ip,
            clientId,
            bodyRes.data.grant_type
          );

          const dct: ClientTokenT = token.decode(cToken);

          return c.json({
            access_token: `eg1~${cToken}`,
            expires_in: dct.exp,
            expires_at: "9999-12-31T23:59:59.999Z",
            token_type: "bearer",
            client_id: clientId,
            internal_client: dct.ic,
            client_service: dct.clsvc,
          });
        }
        case "password": {
          Account = await account
            .findOne({
              email: bodyRes.data.username,
              password: bodyRes.data.password,
            })
            .lean();
          if (!Account) return error.invalidCredentials(c, "account");
          break;
        }
        case "refresh_token": {
          if (!bodyRes.data.refresh_token)
            return error.invalidOAuthRequest(
              c,
              "account",
              "Refesh token is missing."
            );

          const decoded: RefreshTokenT = token.decode(
            bodyRes.data.refresh_token.split("~")[1]
          );
          if (!decoded)
            return error.invalidOAuthRequest(
              c,
              "account",
              "Invalid refresh token."
            );

          let none; // this is just so Promise.all works.
          [none, Account] = await Promise.all([
            token.deleteAccessToken(decoded.sub),
            account.findOne({ accountId: decoded.sub }).lean(),
          ]);
          break;
        }

        default: {
          return error.invalidOAuthRequest(c, "account", "Invalid grant type.");
        }
      }

      if (!Account) return error.invalidCredentials(c, "account");
      if (Account?.banned)
        return error.invalidOAuthRequest(
          c,
          "account",
          "Your account has been banned."
        );

      await Promise.all([
        token.deleteClientToken(ip),
        token.deleteAccessToken(Account.accountId),
        token.deleteRefreshToken(Account.accountId),
      ]);

      const accessToken = token.createAccessToken(
        Account.accountId,
        ip,
        clientId,
        Account.displayName,
        "other",
        Account.banned,
        bodyRes.data.grant_type
      );

      const refreshToken = token.createRefreshToken(
        Account.accountId,
        Account.displayName
      );

      const dat: AccessTokenT = token.decode(accessToken);
      const drt: RefreshTokenT = token.decode(refreshToken);

      return c.json({
        access_token: `eg1~${accessToken}`,
        expires_in: Math.round(
          (new Date(
            new Date(dat.iat).getTime() + 8 * 60 * 60 * 1000
          ).getTime() -
            new Date().getTime()) /
            1000
        ),
        expires_at: new Date(
          new Date(dat.iat).getTime() + 8 * 60 * 60 * 1000
        ).toISOString(),
        token_type: "bearer",
        refresh_token: `eg1~${refreshToken}`,
        refresh_expires: Math.round(
          (new Date(
            new Date(drt.iat).getTime() + 24 * 60 * 60 * 1000
          ).getTime() -
            new Date().getTime()) /
            1000
        ),
        refresh_expires_at: new Date(
          new Date(drt.iat).getTime() + 24 * 60 * 60 * 1000
        ).toISOString(),
        account_id: dat.account.id,
        client_id: clientId,
        internal_client: true,
        client_service: "fortnite",
        displayName: dat.account.displayName,
        app: dat.productId,
        in_app_id: dat.account.id,
        device_id: drt.pfdid,
      });
    });

    app.all(
      "/api/oauth/sessions/kill/:accessToken",
      token.VerifyToken,
      async (c) => {
        if (c.req.method !== "DELETE") return error.method(c);
        const paramsObj = z.object({ accessToken: z.string() });
        const paramsRes = paramsObj.safeParse(c.req.param());
        if (!paramsRes.success) return error.validation(c);
        const accessToken = paramsRes.data.accessToken.split("~")[1];
        const decoded: AccessTokenT = token.decode(accessToken);
        if (!decoded) {
          return error.invalidOAuthRequest(
            c,
            "account",
            "Invalid access token."
          );
        }

        await Promise.all([
          token.deleteAccessToken(decoded.account.id),
          token.deleteRefreshToken(decoded.account.id),
          token.deleteClientToken(decoded.clientIp),
        ]);

        return c.newResponse("", { status: 204 });
      }
    );

    app.all("/api/oauth/sessions/kill", token.VerifyToken, (c) => {
      if (c.req.method !== "DELETE") return error.method(c);
      return c.newResponse("", { status: 204 });
    });

    app.all(
      "/api/public/account/:accountId/externalAuths",
      token.VerifyToken,
      async (c) => {
        if (c.req.method !== "GET") return error.method(c);
        return c.json({});
      }
    );

    app.all("/api/public/account/:accountId", token.VerifyToken, async (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const paramsObj = z.object({ accountId: z.string() });
      const headerObj = z.object({ authorization: z.string() });
      const paramsRes = paramsObj.safeParse(c.req.param());
      const headerRes = headerObj.safeParse(c.req.header());

      if (!paramsRes.success || !headerRes.success) return error.validation(c);
      const dt: AccessTokenT = token.decode(
        headerRes.data.authorization.split("~")[1]
      );

      return c.json({
        id: dt.account.id,
        displayName: dt.account.displayName,
        name: dt.account.displayName,
        email: "[hidden]@neon.de",
        failedLoginAttempts: 0,
        lastLogin: new Date().toISOString(),
        numberOfDisplayNameChanges: 0,
        ageGroup: "UNKNOWN",
        headless: false,
        country: "DE",
        lastName: "Server",
        preferredLanguage: "en",
        canUpdateDisplayName: true,
        tfaEnabled: true,
        emailVerified: true,
        minorVerified: false,
        minorExpected: false,
        minorStatus: "NOT_MINOR",
        cabinedMode: false,
        hasHashedEmail: false,
      });
    });

    app.all("/api/oauth/verify", token.VerifyToken, async (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const headerObj = z.object({ authorization: z.string() });
      const headerRes = headerObj.safeParse(c.req.header());
      if (!headerRes.success) return error.validation(c);
      const dt: AccessTokenT = token.decode(
        headerRes.data.authorization.split("~")[1]
      );

      const refresh = await token.getRefreshToken(dt.account.id);
      if (!refresh) return error.authFailed(c, "account");
      const dtr: RefreshTokenT = token.decode(refresh);

      return c.json({
        token: headerRes.data.authorization.split("~")[1],
        expires_in: 88600,
        expires_at: "2040-12-31T00:00:00.000Z",
        app: dt.productId,
        token_type: headerRes.data.authorization.split("~")[0].toLowerCase(),
        client_service: dt.productId,
        internal_client: dt.ic,
        session_id: dt.sid,
        in_app_id: dt.account.id,
        device_id: dtr.pfdid,
        client_id: dt.clientId,
        account_id: dt.account.id,
        auth_method: dt.am,
        display_name: dt.account.displayName,
      });
    });

    app.all("/api/public/account", async (c) => {
      const userObj = z.object({
        accountId: z.array(z.string()),
      });

      const { data, success } = userObj.safeParse(c.req.queries());
      if (!success) return error.validation(c);

      const accounts = await account
        .find({ accountId: { $in: data.accountId } })
        .lean();

      const resp = accounts.map((Account) => ({
        id: Account.accountId,
        displayName: Account.displayName,
        externalAuths: {},
      }));

      return c.json(resp ? resp : []);
    });

    app.all("/api/public/account/displayName/:displayName", async (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const paramsObj = z.object({ displayName: z.string() });
      const paramsRes = paramsObj.safeParse(c.req.param());
      if (!paramsRes.success) return error.validation(c);
      const Account = await account
        .findOne({ displayName: paramsRes.data.displayName })
        .lean();
      if (!Account) return error.notFound(c, "account");
      return c.json({
        id: Account.accountId,
        displayName: Account.displayName,
        externalAuths: {},
      });
    });
  }
}
