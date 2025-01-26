import type { Hono } from "hono";
import { z } from "zod";
import error from "../utils/error";
import friends from "../model/friends";
import { FriendsResponse } from "../types/types";
import token from "../utils/token";

export default class Friends {
  public route(app: Hono): void {
    app.all("/api/public/friends/:accountId", token.VerifyToken, async (c) => {
      if (c.req.method !== "GET") return error.method(c);

      const paramsObj = z.object({ accountId: z.string() });
      const queryObj = z.object({
        includePending: z.string().transform((x) => {
          return Boolean(x === "true");
        }),
      });
      const paramsRes = paramsObj.safeParse(c.req.param());
      const queryRes = queryObj.safeParse(c.req.query());

      if (!paramsRes.success || !queryRes.success) {
        return error.validation(c, "friends");
      }

      const Friends = await friends
        .findOne({ accountId: paramsRes.data.accountId })
        .lean();

      if (!Friends) return error.notFound(c, "friends");
      let resp: FriendsResponse[] = [];

      for (const friend of Friends?.accepted) {
        resp.push({
          accountId: friend.accountId,
          status: "ACCEPTED",
          direction: "OUTBOUND",
          created: "2000-01-01T00:00:00.000Z",
          favorite: false,
        });
      }

      if (queryRes.data.includePending) {
        for (const friend of Friends?.outgoing) {
          resp.push({
            accountId: friend.accountId,
            status: "PENDING",
            direction: "OUTBOUND",
            created: "2000-01-01T00:00:00.000Z",
            favorite: false,
          });
        }

        for (const friend of Friends?.incoming) {
          resp.push({
            accountId: friend.accountId,
            status: "PENDING",
            direction: "INBOUND",
            created: "2000-01-01T00:00:00.000Z",
            favorite: false,
          });
        }
      }

      return c.json(resp);
    });

    app.all(
      "/api/public/blocklist/:accountId",
      token.VerifyToken,
      async (c) => {
        if (c.req.method !== "GET") return error.method(c);

        const paramsObj = z.object({ accountId: z.string() });
        const paramsRes = paramsObj.safeParse(c.req.param());
        if (!paramsRes.success) return error.validation(c, "friends");

        const Friends = await friends
          .findOne({ accountId: paramsRes.data.accountId })
          .lean();

        if (!Friends) return error.notFound(c, "friends");

        return c.json({
          blockedUsers: Friends.blocked.map((x) => x.accountId),
        });
      }
    );

    app.all(
      "/api/public/list/fortnite/:accountId/recentPlayers",
      token.VerifyToken,
      (c) => {
        if (c.req.method !== "GET") return error.method(c);

        return c.json({
          recentPlayers: [],
        });
      }
    );

    app.all("/friends/api/v1/:accountId/settings", token.VerifyToken, (c) => {
      if (c.req.method !== "GET") return error.method(c);
      return c.json({});
    });
  }
}
