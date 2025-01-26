import { Hono } from "hono";

import utils from "../utils/utils";
import error from "../utils/error";
import account from "../model/account";
import profiles from "../model/profiles";
import friends from "../model/friends";

export default class Auth {
  public route(app: Hono): void {
    /*app.all("/api/create", async (c) => {
      const sub = utils.getId();
      const acc = new account({
        accountId: sub,
        email: "secret@.",
        password: "1",
        displayName: "not_secret1337",
        discordId: "0",
      });
      const fri = new friends({ accountId: sub });
      const pro = new profiles({ accountId: sub });

      await Promise.all([acc.save(), fri.save(), pro.save()]);
      return c.json({ success: true });
    });*/
  }
}
