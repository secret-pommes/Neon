import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const loadDefaultProfile = (filename: string) =>
  JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../resources/default_profiles", filename),
      "utf8"
    )
  );

const defaultProfiles = {
  athena: loadDefaultProfile("athena.json"),
  campaign: loadDefaultProfile("campaign.json"),
  collection_book_people0: loadDefaultProfile("collection_book_people0.json"),
  collection_book_schematics0: loadDefaultProfile("collection_book_schematics0.json"),
  collections: loadDefaultProfile("collections.json"),
  common_core: loadDefaultProfile("common_core.json"),
  common_public: loadDefaultProfile("common_public.json"),
  creative: loadDefaultProfile("creative.json"),
  metadata: loadDefaultProfile("metadata.json"),
  outpost0: loadDefaultProfile("outpost0.json"),
  profile0: loadDefaultProfile("profile0.json"),
  theater0: loadDefaultProfile("theater0.json"),
};

export default mongoose.model(
  "Profiles",
  new mongoose.Schema(
    {
      accountId: { type: String, required: true },
      created: { type: Date, default: Date.now },
      bFullAthenaProfile: { type: Boolean, default: false },
      athena: { type: Object, default: defaultProfiles.athena },
      campaign: { type: Object, default: defaultProfiles.campaign },
      collection_book_people0: { type: Object, default: defaultProfiles.collection_book_people0, },
      collection_book_schematics0: { type: Object, default: defaultProfiles.collection_book_schematics0, },
      collections: { type: Object, default: defaultProfiles.collections },
      common_core: { type: Object, default: defaultProfiles.common_core },
      common_public: { type: Object, default: defaultProfiles.common_public },
      creative: { type: Object, default: defaultProfiles.creative },
      metadata: { type: Object, default: defaultProfiles.metadata },
      outpost0: { type: Object, default: defaultProfiles.outpost0 },
      profile0: { type: Object, default: defaultProfiles.profile0 },
      theater0: { type: Object, default: defaultProfiles.theater0 },
      PendingProfileChangesAthena: { type: Array, default: [] },
      PendingProfileChangesCommonCore: { type: Array, default: [] },
      PendingProfileChangesCommonPublic: { type: Array, default: [] },
      optOutOfPublicLeaderboards: { type: Boolean, default: false },
    },
    {
      collection: "Profiles",
      minimize: false,
    }
  )
);
