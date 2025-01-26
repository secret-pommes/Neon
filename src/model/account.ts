import mongoose from "mongoose";

export default mongoose.model(
  "Accounts",
  new mongoose.Schema(
    {
      accountId: { type: String, required: true },
      created: { type: String, default: new Date().toISOString() },
      discordId: { type: String, required: true },
      displayName: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      banned: { type: Boolean, default: false },
      buildId: { type: String, default: "0" },
    },
    {
      collection: "Accounts",
      minimize: false,
    }
  )
);
