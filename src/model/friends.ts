import mongoose from "mongoose";

export default mongoose.model(
  "Friends",
  new mongoose.Schema(
    {
      accountId: { type: String, required: true },
      created: { type: String, default: new Date().toISOString() },
      accepted: { type: Array, default: [] },
      blocked: { type: Array, default: [] },
      incoming: { type: Array, default: [] },
      outgoing: { type: Array, default: [] },
    },
    { collection: "Friends", minimize: false }
  )
);
