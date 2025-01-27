import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import profiles from "../model/profiles";

class DBStuff {
  private defaultProfiles: any;
  constructor() {
    const loadDefaultProfile = (filename: string) =>
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../resources/default_profiles", filename),
          "utf8"
        )
      );

    this.defaultProfiles = {
      athena: loadDefaultProfile("athena.json"),
      campaign: loadDefaultProfile("campaign.json"),
      collection_book_people0: loadDefaultProfile(
        "collection_book_people0.json"
      ),
      collection_book_schematics0: loadDefaultProfile(
        "collection_book_schematics0.json"
      ),
      collections: loadDefaultProfile("collections.json"),
      common_core: loadDefaultProfile("common_core.json"),
      common_public: loadDefaultProfile("common_public.json"),
      creative: loadDefaultProfile("creative.json"),
      metadata: loadDefaultProfile("metadata.json"),
      outpost0: loadDefaultProfile("outpost0.json"),
      profile0: loadDefaultProfile("profile0.json"),
      theater0: loadDefaultProfile("theater0.json"),
    };
  }
  public ResetProfile = async (accountId: string) => {
    await profiles.updateOne(
      { accountId },
      {
        $set: {
          athena: this.defaultProfiles.athena,
          campaign: this.defaultProfiles.campaign,
          collection_book_people0: this.defaultProfiles.collection_book_people0,
          collection_book_schematics0:
            this.defaultProfiles.collection_book_schematics0,
          collections: this.defaultProfiles.collections,
          common_core: this.defaultProfiles.common_core,
          common_public: this.defaultProfiles.common_public,
          creative: this.defaultProfiles.creative,
          metadata: this.defaultProfiles.metadata,
          outpost0: this.defaultProfiles.outpost0,
          profile0: this.defaultProfiles.profile0,
          theater0: this.defaultProfiles.theater0,
        },
      }
    );
  };
}

export default new DBStuff();