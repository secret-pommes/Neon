import { Hono } from "hono";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import type { Context } from "hono";
import { AccessTokenT, HotfixResp } from "../types/types";

import error from "../utils/error";
import token from "../utils/token";
import utils from "../utils/utils";
import log from "../utils/log";
import profiles from "../model/profiles";

export default class Fortnite {
  public route(app: Hono): void {
    app.all(
      "/api/game/v2/tryPlayOnPlatform/account/:accountId",
      token.VerifyToken,
      (c) => {
        if (c.req.method !== "POST") return error.method(c);
        return c.text("true");
      }
    );

    app.all("/api/game/v2/enabled_features", token.VerifyToken, (c) => {
      if (c.req.method !== "GET") return error.method(c);
      return c.json([]);
    });

    app.all("/api/game/v2/grant_access/:accountId", token.VerifyToken, (c) => {
      if (c.req.method !== "POST") return error.method(c);
      return c.newResponse("", { status: 204 });
    });

    app.all(
      "/api/game/v2/profile/:accountId/:type/:command",
      token.VerifyToken,
      async (c) => {
        if (c.req.method !== "POST") return error.method(c);

        const paramsObj = z.object({
          accountId: z.string(),
          type: z.enum(["client", "dedicated_server"]),
          command: z.string(),
        });
        const headerObj = z.object({
          authorization: z.string(),
          "user-agent": z.string(),
          "x-epic-correlation-id": z.string(),
        });

        const paramsRes = paramsObj.safeParse(c.req.param());
        const headerRes = headerObj.safeParse(c.req.header());

        if (!paramsRes.success || !headerRes.success) {
          return error.validation(c);
        }

        const dt: AccessTokenT = token.decode(
          headerRes.data.authorization.split("~")[1]
        );
        if (!dt) return error.authFailed(c, "mcp");

        try {
          const filePath = path.join(
            __dirname,
            `MCP/${paramsRes.data.type}/${paramsRes.data.command}.ts`
          );
          let handler: { route(c: Context): Promise<object> }; // 99% object

          try {
            handler = (await import(filePath)).default;
          } catch (e) {
            handler = (await import(`./MCP/${paramsRes.data.type}/default.ts`))
              .default;
          }

          const resp: any = await handler.route(c);

          // i think thats more safe.
          let bIsError: boolean = false;
          try {
            bIsError = resp.errorCode;
          } catch {}

          return c.json(resp, bIsError ? 400 : 200);
        } catch (e) {
          log.error(e);
          return c.text("", 500);
        }
      }
    );

    app.all("/api/calendar/v1/timeline", (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const storefrontEnd = utils.EndOfDayISOString();
      const { seasonStr, seasonInt } = utils.FNVer(c);

      return c.json({
        channels: {
          "client-matchmaking": {
            states: [
              {
                validForm: "2000-01-01T00:00:00.000Z",
                activeEvents: [],
                state: {
                  region: {
                    EU: {
                      eventFlagsForcedOff: [],
                    },
                    NA: {
                      eventFlagsForcedOff: [],
                    },
                  },
                },
              },
            ],
            cacheExpire: "2040-12-31T00:00:00.000Z",
          },
          "client-events": {
            states: [
              {
                validFrom: "2000-01-01T00:00:00.000Z",
                activeEvents: [
                  {
                    eventType: `EventFlag.Season${seasonStr}`,
                    activeUntil: "2040-12-31T00:00:00.000Z",
                    activeSince: "2000-01-01T00:00:00.000Z",
                  },
                  {
                    eventType: `EventFlag.LobbySeason${seasonStr}`,
                    activeUntil: "2040-12-31T00:00:00.000Z",
                    activeSince: "2000-01-01T00:00:00.000Z",
                  },
                ],
                state: {
                  activeStorefronts: [],
                  eventNamedWeights: {},
                  seasonNumber: seasonInt,
                  seasonTemplateId: `AthenaSeason:athenaseason${seasonStr}`,
                  matchXpBonusPoints: 0,
                  seasonBegin: "2000-01-01T00:00:00.000Z",
                  seasonEnd: "2040-12-31T00:00:00.000Z",
                  seasonDisplayedEnd: "2040-12-31T00:00:00.000Z",
                  weeklyStoreEnd: storefrontEnd,
                  sectionStoreEnds: { Featured: storefrontEnd },
                  dailyStoreEnd: storefrontEnd,
                  stwEventStoreEnd: storefrontEnd,
                  stwWeeklyStoreEnd: storefrontEnd,
                },
              },
            ],
            cacheExpire: storefrontEnd,
          },
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 15,
        currentTime: new Date().toISOString(),
      });
    });

    app.all("/api/v2/versioncheck/:platform", (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const paramsObj = z.object({
        platform: z.enum(["Windows", "PS4", "Switch", "IOS", "Android"]),
      });
      const paramsRes = paramsObj.safeParse(c.req.param());
      if (!paramsRes.success) return error.validation(c);

      return c.json({ type: "NO_UPDATE" });
    });

    app.all("/api/cloudstorage/system", (c) => {
      if (c.req.method !== "GET") return error.method(c);

      const base = path.join(__dirname, "../resources/hotfixes");
      const hotfixes = fs
        .readdirSync(base, "utf8")
        .filter((file) => file.endsWith(".ini"));
      let resp: HotfixResp[] = [];

      for (const file of hotfixes) {
        resp.push({
          uniqueFilename: file,
          filename: file,
          hash: crypto
            .createHash("sha1")
            .update(fs.readFileSync(path.join(base, file)))
            .digest("hex"),
          hash256: crypto
            .createHash("sha256")
            .update(fs.readFileSync(path.join(base, file)))
            .digest("hex"),
          length: fs.statSync(path.join(base, file)).size,
          contentType: "application/octet-stream",
          uploaded: fs.statSync(path.join(base, file)).mtime,
          storageIds: {},
          storageType: "",
          doNotCache: true,
        });
      }

      return c.json(resp);
    });

    app.all("/api/cloudstorage/system/:file", (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const paramsObj = z.object({ file: z.string() });
      const paramsRes = paramsObj.safeParse(c.req.param());
      if (!paramsRes.success) return error.validation(c);
      const base = path.join(__dirname, "../resources/hotfixes");
      const files = fs
        .readdirSync(base, "utf8")
        .filter((file) => file.endsWith(".ini"));
      const sanitized = path.basename(paramsRes.data.file);
      if (!sanitized.endsWith(".ini")) return error.notFound(c);
      const resolved = path.resolve(base, sanitized);
      if (!resolved.startsWith(base)) return error.notFound(c);
      const file = files.find((x) => x === sanitized);
      if (!file) return error.notFound(c);
      const content = fs.readFileSync(path.join(base, file), "utf8");
      return c.newResponse(content, {
        headers: { "Content-Type": "application/octet-stream" },
      });
    });

    app.all("/api/cloudstorage/user/:accountId", async (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const paramsObj = z.object({ accountId: z.string() });
      const paramsRes = paramsObj.safeParse(c.req.param());
      if (!paramsRes.success) return error.validation(c);
      const Profiles = await profiles
        .findOne({ accountId: paramsRes.data.accountId })
        .lean();
      if (!Profiles) return error.notFound(c);
      if (!Profiles.cloudstorage) return c.json([]);
      const platform = utils
        .ClientInfo(c)
        .platform.toLowerCase() as keyof typeof platformFiles;

      const platformFiles = {
        windows: "ClientSettings.Sav",
        switch: "ClientSettingsSwitch.Sav",
        android: "ClientSettingsAndroid.Sav",
        ios: "ClientSettingsIOS.Sav",
        ps4: "ClientSettingsPS4.Sav",
      };

      const fileName = platformFiles[platform];
      return c.json([
        {
          uniqueFilename: fileName,
          filename: fileName,
          hash: crypto
            .createHash("sha1")
            .update(Profiles.cloudstorage)
            .digest("hex"),
          hash256: crypto
            .createHash("sha256")
            .update(Profiles.cloudstorage)
            .digest("hex"),
          length: Profiles.cloudstorage.length,
          contentType: "application/octet-stream",
          uploaded: "2000-01-01T00:00:00.000Z",
          storageType: "",
          storageIds: {},
          accountId: paramsRes.data.accountId,
          doNotCache: false,
          platform,
        },
      ]);
    });

    app.all(
      "/api/cloudstorage/user/:accountId/:file",
      token.VerifyToken,
      async (c) => {
        const paramsObj = z.object({ accountId: z.string(), file: z.string() });
        const paramsRes = paramsObj.safeParse(c.req.param());
        if (!paramsRes.success) return error.validation(c);
        switch (c.req.method) {
          case "GET": {
            const Profiles = await profiles.findOne({
              accountId: paramsRes.data.accountId,
            });
            if (!Profiles) return error.notFound(c);
            if (!Profiles.cloudstorage) {
              return c.newResponse("", { status: 204 });
            }

            c.header("Content-Type", "application/octet-stream");
            return c.body(Profiles.cloudstorage);
          }
          case "PUT": {
            const data = await c.req.arrayBuffer();
            await profiles.updateOne(
              { accountId: paramsRes.data.accountId },
              { cloudstorage: Buffer.from(data).toString("utf-8") }
            );
            return c.newResponse("", { status: 204 });
          }
          default: {
            return error.method(c);
          }
        }
      }
    );

    app.all("/api/storefront/v2/keychain", token.VerifyToken, (c) => {
      const resp = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../resources/keychain.json"),
          "utf8"
        )
      );
      return c.json(resp);
    });

    app.all("/api/storefront/v2/catalog", (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const expiration = utils.EndOfDayISOString();
      return c.json({
        refreshIntervalHrs: 24,
        dailyPurchaseHrs: 24,
        expiration,
        storefronts: [
          {
            name: "BRDailyStorefront",
            catalogEntries: [],
          },
          {
            name: "BRWeeklyStorefront",
            catalogEntries: [],
          },
        ],
      });
    });

    app.all(
      "/api/game/v2/privacy/account/:accountId",
      token.VerifyToken,
      async (c) => {
        const userObj = z.object({ accountId: z.string() });
        const user = userObj.safeParse(c.req.param());
        if (!user.success) return error.validation(c);

        switch (c.req.method) {
          case "GET": {
            const Profiles = await profiles
              .findOne({ accountId: user.data.accountId })
              .lean();
            return c.json({
              accountId: user.data.accountId,
              optOutOfPublicLeaderboards: Profiles?.optOutOfPublicLeaderboards,
            });
          }
          case "POST": {
            const { optOutOfPublicLeaderboards } = await c.req.json();
            await profiles.updateOne(
              { accountId: user.data.accountId },
              { optOutOfPublicLeaderboards }
            );
            return c.json({
              accountId: user.data.accountId,
              optOutOfPublicLeaderboards,
            });
          }

          default: {
            return error.method(c);
          }
        }
      }
    );
  }
}
