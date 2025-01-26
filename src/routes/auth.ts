import { Hono } from "hono";

import utils from "../utils/utils";
import error from "../utils/error";
import account from "../model/account";
import profiles from "../model/profiles";
import friends from "../model/friends";

export default class Auth {
  public route(app: Hono): void {
   /* app.all("/api/create", async (c) => {
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

      pro.athena.created = new Date().toISOString();
      pro.campaign.created = new Date().toISOString();
      pro.collection_book_people0.created = new Date().toISOString();
      pro.collection_book_schematics0.created = new Date().toISOString();
      pro.collections.created = new Date().toISOString();
      pro.common_core.created = new Date().toISOString();
      pro.common_public.created = new Date().toISOString();
      pro.creative.created = new Date().toISOString();
      pro.metadata.created = new Date().toISOString();
      pro.outpost0.created = new Date().toISOString();
      pro.profile0.created = new Date().toISOString();
      pro.theater0.created = new Date().toISOString();

      pro.athena.updated = new Date().toISOString();
      pro.campaign.updated = new Date().toISOString();
      pro.collection_book_people0.updated = new Date().toISOString();
      pro.collection_book_schematics0.updated = new Date().toISOString();
      pro.collections.updated = new Date().toISOString();
      pro.common_core.updated = new Date().toISOString();
      pro.common_public.updated = new Date().toISOString();
      pro.creative.updated = new Date().toISOString();
      pro.metadata.updated = new Date().toISOString();
      pro.outpost0.updated = new Date().toISOString();
      pro.profile0.updated = new Date().toISOString();
      pro.theater0.updated = new Date().toISOString();

      pro.athena.accountId = sub;
      pro.campaign.accountId = sub;
      pro.collection_book_people0.accountId = sub;
      pro.collection_book_schematics0.accountId = sub;
      pro.collections.accountId = sub;
      pro.common_core.accountId = sub;
      pro.common_public.accountId = sub;
      pro.creative.accountId = sub;
      pro.metadata.accountId = sub;
      pro.outpost0.accountId = sub;
      pro.profile0.accountId = sub;
      pro.theater0.accountId = sub;

      await Promise.all([acc.save(), fri.save(), pro.save()]);
      return c.json({ success: true });
    });*/
  }
}
