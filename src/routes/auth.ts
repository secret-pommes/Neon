import { Hono } from "hono";
import { z } from "zod";
import axios from "axios";

import safety from "../utils/safety";
import utils from "../utils/utils";
import error from "../utils/error";
import account from "../model/account";
import profiles from "../model/profiles";
import friends from "../model/friends";
import { DiscordServerResp } from "../types/types";

export default class Auth {
  public route(app: Hono): void {
    app.all("/api/discord/redirect", (c) => {
      if (c.req.method !== "GET") return error.method(c);
      return c.redirect(safety.env.DISCORD_REDIRECT_URI);
    });

    app.all("/api/discord/callback", async (c) => {
      const queryObj = z.object({
        code: z.string(),
      });
      const queryRes = queryObj.safeParse(c.req.query());
      if (!queryRes.success) return error.validation(c);

      try {
        const access: { status: number; data: { access_token: string } } =
          await axios.post(
            "https://discord.com/api/v7/oauth2/token",
            {
              code: queryRes.data.code,
              client_id: safety.env.DISCORD_CLIENT_ID,
              client_secret: safety.env.DISCORD_CLIENT_SECRET,
              redirect_uri: `http://127.0.0.1:1000/auth/api/discord/callback`,
              grant_type: "authorization_code",
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

        const server: { data: DiscordServerResp; status: number } =
          await axios.get(
            `https://discord.com/api/users/@me/guilds/${safety.env.DISCORD_GUILD_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${access.data.access_token}`,
              },
            }
          );

        if (server.status !== 200 || !server.data.joined_at) {
          return error.authFailed(c);
        }

        const existingAccount = await account
          .findOne({
            discordId: server.data.user.id,
          })
          .lean();
        if (existingAccount) {
          return c.text(
            `Welcome back, ${existingAccount.displayName}\n\nEMAIL: ${existingAccount.email}\nPASSWORD: ${existingAccount.password}`
          );
        }

        const accountId = utils.getId();
        const acc = new account({
          email: `${utils.getUUID()}@neon.dev`,
          password: utils.getUUID(),
          discordId: server.data.user.id,
          displayName: server.data.user.global_name,
          accountId,
        });
        const fri = new friends({ accountId });
        const pro = new profiles({ accountId });

        acc.save();
        fri.save();
        pro.save();

        return c.text(
          `Welcome ${acc.displayName}\n\nEMAIL: ${acc.email}\nPASSWORD: ${acc.password}`
        );
      } catch {
        return error.serverError(c, "auth");
      }
    });
  }
}
