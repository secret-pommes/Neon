import type { Context } from "hono";
import { z } from "zod";

import MCPErrors from "../../../utils/MCPErrors";
import profiles from "../../../model/profiles";

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
    const bodyObj = z.object({ newPlatform: z.string() });

    const paramsRes = paramsObj.safeParse(c.req.param());
    const queryRes = queryObj.safeParse(c.req.query());
    const bodyRes = bodyObj.safeParse(await c.req.json());

    if (!paramsRes.success || !queryRes.success || !bodyRes.success) {
      return MCPErrors.validation(c, "mcp");
    }

    const Profiles: any = await profiles
      .findOne({ accountId: paramsRes.data.accountId })
      .lean();

    if (!Profiles) return MCPErrors.authFailed(c);

    const profile = Profiles[queryRes.data.profileId];
    const baseRevision: number = profile.rvn;
    const commandRevision: number = profile.commandRevision;

    profile.accountId = paramsRes.data.accountId;

    if (queryRes.data.profileId !== "common_core") {
      return MCPErrors.profileNotFound(
        "SetMtxPlatform",
        queryRes.data.profileId
      );
    }

    if (!profile) {
      return MCPErrors.notFound(c, "profile");
    }

    let profileChanges: any[] = [];

    profile.rvn++;
    profile.commandRevision++;
    profile.stats.attributes.current_mtx_platform = bodyRes.data.newPlatform;

    profileChanges.push({
      changeType: "statModified",
      name: "setmtxplatform",
      value: bodyRes.data.newPlatform,
    });

    if (baseRevision !== queryRes.data.rvn) {
      profileChanges = [
        {
          changeType: "fullProfileUpdate",
          profile,
        },
      ];
    }

    await profiles.updateOne(
      { accountId: paramsRes.data.accountId },
      { $set: { common_core: profile } }
    );
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
