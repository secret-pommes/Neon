import type { Context } from "hono";
import { z } from "zod";

import MCPErrors from "../../../utils/MCPErrors";
import profiles from "../../../model/profiles";
import { slot, variants } from "../../../types/types";

class Route {
  public async route(c: Context): Promise<any> {
    const paramsObj = z.object({
      accountId: z.string(),
    });
    const queryObj = z.object({
      profileId: z.string(),
      rvn: z.string().transform((v) => {
        return Number(v);
      }),
    });
    const bodyObj = z.object({
      slotName: z.string(),
      itemToSlot: z.string(),
      indexWithinSlot: z.number(),
      variantUpdates: z
        .array(
          z.object({
            active: z.string(),
            channel: z.string(),
            owned: z.array(z.string()),
          })
        )
        .optional(),
    });

    const body = await c.req.json();

    const paramsRes = paramsObj.safeParse(c.req.param());
    const queryRes = queryObj.safeParse(c.req.query());
    const bodyRes = bodyObj.safeParse(body);

    if (!paramsRes.success || !queryRes.success || !bodyRes.success) {
      return MCPErrors.validation(c, "mcp");
    }

    if (queryRes.data.profileId !== "athena") {
      return MCPErrors.profileNotFound(
        "EquipBattleRoyaleCustomization",
        queryRes.data.profileId
      );
    }

    const Profiles: any = await profiles
      .findOne({ accountId: paramsRes.data.accountId })
      .lean();

    const profile = Profiles[queryRes.data.profileId];
    const baseRevision: number = profile.rvn;
    const commandRevision: number = profile.commandRevision;

    if (!profile) {
      return MCPErrors.notFound(c, "profile");
    }

    let profileChanges: any[] = [];
    let bChanged = false;

    switch (bodyRes.data.slotName) {
    case "Character": {
      profile.stats.attributes.favorite_character = bodyRes.data.itemToSlot;

      if (Array.isArray(bodyRes.data.variantUpdates) && bodyRes.data.variantUpdates.length > 0) {
        for (const variantUpdate of bodyRes.data.variantUpdates) {
        const { channel, active } = variantUpdate;
        const slot: slot = profile.items[bodyRes.data.itemToSlot];
        if (!slot || !channel || !active) continue;

        const ownedVariants = slot.attributes.variants;
        if (!ownedVariants) continue;

        const variantIndex = ownedVariants.findIndex((v) => v.channel === channel);
        if (variantIndex === -1) continue;

        const ownsVariant = ownedVariants[variantIndex].owned.includes(active);
        if (!ownsVariant) continue;

        profile.items[bodyRes.data.itemToSlot].attributes.variants[variantIndex].active = active;

        profileChanges.push({
          changeType: "itemAttrChanged",
          attributeName: "variants",
          itemId: bodyRes.data.itemToSlot,
          attributeValue: profile.items[bodyRes.data.itemToSlot].attributes.variants,
        });
        }
      }

      bChanged = true;
      break;
    }
      case "Backpack": {
        profile.stats.attributes.favorite_backpack = bodyRes.data.itemToSlot;
        bChanged = true;
        break;
      }
      case "Pickaxe": {
        profile.stats.attributes.favorite_pickaxe = bodyRes.data.itemToSlot;
        bChanged = true;
        break;
      }
      case "Glider": {
        profile.stats.attributes.favorite_glider = bodyRes.data.itemToSlot;
        bChanged = true;
        break;
      }
      case "SkyDiveContrail": {
        profile.stats.attributes.favorite_skydivecontrail =
          bodyRes.data.itemToSlot;
        bChanged = true;
        break;
      }
      case "MusicPack": {
        profile.stats.attributes.favorite_musicpack = bodyRes.data.itemToSlot;
        bChanged = true;
        break;
      }
      case "LoadingScreen": {
        profile.stats.attributes.favorite_loadingscreen =
          bodyRes.data.itemToSlot;
        bChanged = true;
        break;
      }
      case "Dance": {
        profile.stats.attributes.favorite_dance[bodyRes.data.indexWithinSlot] =
          bodyRes.data.itemToSlot;
        bodyRes.data.itemToSlot = profile.stats.attributes.favorite_dance;
        bChanged = true;
        break;
      }
      case "ItemWrap": {
        if (bodyRes.data.indexWithinSlot === -1) {
          profile.stats.attributes.favorite_itemwraps = new Array(7).fill(
            bodyRes.data.itemToSlot
          );
        } else {
          profile.stats.attributes.favorite_itemwraps[
            bodyRes.data.indexWithinSlot
          ] = bodyRes.data.itemToSlot;
        }

        bodyRes.data.itemToSlot = profile.stats.attributes.favorite_itemwraps;
        bChanged = true;
        break;
      }
      default: {
        return MCPErrors.validation(c, "mcp");
      }
    }

    if (bChanged) {
      profile.rvn++;
      profile.commandRevision++;
      profile.updated = new Date().toISOString();

      profileChanges.push({
        changeType: "statModified",
        name: `favorite_${bodyRes.data.slotName.toLowerCase()}`,
        value: bodyRes.data.itemToSlot,
      });
    }

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
      { $set: { athena: profile } }
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
