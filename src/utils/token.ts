import Redis from "ioredis";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

import type { Context, Next } from "hono";
import { AccessTokenT, RefreshTokenT, ClientTokenT } from "../types/types";

import safety from "./safety";
import utils from "./utils";
import log from "./log";
import error from "./error";

interface DTA extends JwtPayload {
  clientId: string;
  role: string;
  productId: string;
  iss: string;
  env: string;
  nonce: string;
  organizationId: string;
  features: string[];
  productUserId: string;
  organizationUserId: string;
  clientIp: string;
  deploymentId: string;
  sandboxId: string;
  tokenType: string;
  exp: number;
  iat: number;
  account: {
    idp: string;
    displayName: string;
    id: string;
    plf: string;
  };
  jti: string;
}

class Token {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: safety.env.REDIS_HOST,
      port: safety.env.REDIS_PORT,
      db: safety.env.REDIS_DB,
    }).on("connect", () => log.info("Connected to Redis"));

    this.VerifyToken = this.VerifyToken.bind(this);
  }

  // CLIENT TOKEN
  public setClientToken(ipv4: string, clientToken: string): void {
    this.redis.set(ipv4, clientToken, "EX", 3600);
  }

  public async getClientToken(ipv4: string): Promise<string | null> {
    const t = await this.redis.get(ipv4);
    return t;
  }

  public async deleteClientToken(ipv4: string): Promise<void> {
    await this.redis.del(ipv4);
  }

  public createClientToken(
    ipv4: string,
    clientId: string,
    grantType: string
  ): string {
    const payload: ClientTokenT = {
      p: "unknown",
      clsvc: "prod-fn",
      t: "s",
      mver: false,
      cid: clientId,
      ic: true,
      exp: Math.floor((Date.now() + 3600 * 1000) / 1000),
      am: grantType,
      iat: Math.floor(Date.now() / 1000),
      jti: Math.random().toString(36).substring(7),
      pfpid: "prod-fn",
    };

    const t = jwt.sign(payload, safety.env.JWT_SECRET);
    this.setClientToken(ipv4, t);
    return t;
  }

  // ACCESS TOKEN
  public setAccessToken(accountId: string, accessToken: string): void {
    this.redis.set(`AT:${accountId}`, accessToken, "EX", 3600);
  }

  public async getAccessToken(accountId: string): Promise<string | null> {
    const t = await this.redis.get(`AT:${accountId}`);
    return t;
  }

  public async deleteAccessToken(accountId: string): Promise<void> {
    await this.redis.del(`AT:${accountId}`);
  }

  public createAccessToken(
    accountId: string,
    ipv4: string,
    clientId: string,
    displayName: string,
    platform: string = "other",
    banned: boolean,
    grantType: string
  ): string {
    const payload: AccessTokenT = {
      role: "GameClient",
      productId: "prod-fn",
      iss: "neon",
      env: "prod",
      nonce: "",
      organizationId: "o-neon",
      features: [],
      productUserId: accountId,
      organizationUserId: utils.getUUID(),
      clientIp: ipv4,
      deploymentId: utils.getUUID(),
      sandboxId: utils.getUUID(),
      clientId,
      tokenType: "userToken",
      exp: Date.now() + 3600,
      iat: Date.now(),
      account: {
        idp: "neon",
        displayName,
        id: accountId,
        plf: platform,
        bnd: banned,
      },
      am: grantType,
      sid: utils.getUUID(),
      ic: true,
      jti: Math.random().toString(36).substring(7),
    };

    const t = jwt.sign(payload, safety.env.JWT_SECRET);
    this.setAccessToken(accountId, t);
    return t;
  }

  // REFRESH TOKEN
  public setRefreshToken(accountId: string, refreshToken: string): void {
    this.redis.set(`RT:${accountId}`, refreshToken, "EX", 86400);
  }

  public async getRefreshToken(accountId: string): Promise<string | null> {
    const t = await this.redis.get(`RT:${accountId}`);
    return t;
  }

  public async deleteRefreshToken(accountId: string): Promise<void> {
    await this.redis.del(`RT:${accountId}`);
  }

  public createRefreshToken(accountId: string, displayName: string): string {
    const payload: RefreshTokenT = {
      sub: accountId,
      pfsid: utils.getUUID(),
      pfdid: utils.getUUID(),
      aud: utils.getUUID(),
      appid: utils.getUUID(),
      pfpid: "prod-fn",
      iss: "neon",
      dn: displayName,
      scope: "basic_profile friends_list openid offline_access presence",
      iat: Date.now(),
      jti: Math.random().toString(36).substring(7),
      t: "s",
    };

    const t = jwt.sign(payload, safety.env.JWT_SECRET, { expiresIn: "1d" });

    this.setRefreshToken(accountId, t);
    return t;
  }

  public decode(t: string): any {
    return jwt.decode(t);
  }

  public async VerifyToken(c: Context, next: Next) {
    const headerObj = z.object({
      authorization: z.string(),
      "x-real-ip": z.string().optional(),
      host: z.string(),
    });
    const { data, success } = headerObj.safeParse(c.req.header());
    if (!success) return error.validation(c);
    const token = data.authorization.split("~")[1];
    if (!token) return error.authFailed(c, c.req.path.split("/")[1]); // not good but who cares fr.

    try {
      const dt: DTA = jwt.verify(token, safety.env.JWT_SECRET) as DTA; // not good.
      const ipv4 = data["x-real-ip"] || data.host.split(":")[0];
      if (ipv4 !== dt.clientIp)
        return error.authFailed(c, c.req.path.split("/")[1]);
      const t = await this.getAccessToken.call(this, dt.account.id);
      if (!t) return error.authFailed(c, c.req.path.split("/")[1]);
      const dta: AccessTokenT = this.decode(t);
      if (dta.account.id !== dt.account.id)
        return error.authFailed(c, c.req.path.split("/")[1]);
      return await next();
    } catch (e) {
      log.error(e);
      return error.authFailed(c, c.req.path.split("/")[1]);
    }
  }
}

export default new Token();
