import type { Context } from "hono";
import { z } from "zod";

import MCPErrors from "../../../utils/MCPErrors";
import profiles from "../../../model/profiles";
import utils from "../../../utils/utils";

class Route {
  public async route(c: Context): Promise<any> {
    const paramsObj = z.object({
      accountId: z.string(),
    });
    const queryObj = z.object({
      profileId: z.enum([
        "athena",
        "campaign",
        "collection_book_people0",
        "collection_book_schematics0",
        "collections",
        "common_core",
        "common_public",
        "creative",
        "metadata",
        "outpost0",
        "profile0",
        "theater0",
      ]),
      rvn: z.string().transform((v) => Number(v)),
    });

    const paramsRes = paramsObj.safeParse(c.req.param());
    const queryRes = queryObj.safeParse(c.req.query());

    if (!paramsRes.success || !queryRes.success) {
      return MCPErrors.validation(c, "mcp");
    }

    const Profiles: any = await profiles
      .findOne({ accountId: paramsRes.data.accountId })
      .lean();

    if (!Profiles) return MCPErrors.authFailed(c);

    const profile = Profiles[queryRes.data.profileId];
    const baseRevision: number = profile.rvn;
    const commandRevision: number = profile.commandRevision;
    let bChanged = false;

    if (!profile.accountId) {
      profile.accountId = paramsRes.data.accountId;
      bChanged = true;
    }
    if (!profile.created) {
      profile.created = new Date().toISOString();
      bChanged = true;
    }

    if (queryRes.data.profileId === "athena") {
      const { seasonInt } = utils.FNVer(c);
      profile.stats.attributes.season_num = Number.isNaN(seasonInt)
        ? 0
        : seasonInt;
    }

    if (!profile) {
      return MCPErrors.notFound(c, "profile");
    }

    let profileChanges: any[] = [];

    if (baseRevision !== queryRes.data.rvn) {
      profileChanges = [
        {
          changeType: "fullProfileUpdate",
          profile,
        },
      ];
    }

    if (bChanged) {
      await profiles.updateOne(
        { accountId: paramsRes.data.accountId },
        { $set: { [queryRes.data.profileId]: profile } }
      );
    }
    return {
      profileRevision: profile.rvn,
      profileId: queryRes.data.profileId,
      profileChangesBaseRevision: baseRevision,
      profileChanges,
      profileCommandRevision: commandRevision,
      serverTime: new Date().toISOString(),
      responseVersion: 1,
    };
  }
}

export default new Route();
