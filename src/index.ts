import { Hono } from "hono";
import { logger } from "hono/logger";
import mongoose from "mongoose";
import path from "node:path";

import safety from "./utils/safety";
import loader from "./utils/loader";
import log from "./utils/log";
import error from "./utils/error";
import dbstuff from "./dev/dbstuff";

const app = new Hono({ strict: false });
app.use("*", logger());

mongoose
  .connect(safety.env.MONGO_URI, {
    user: safety.env.MONGO_USR,
    pass: safety.env.MONGO_PWD,
    dbName: safety.env.MONGO_DB,
  })
  .then(() => log.info("Connected to MongoDB"));

(async () => {
  await loader.register(path.join(__dirname, "routes"), app);
})();

app.notFound((c) => error.notFound(c, "common"));

//dbstuff.ResetProfile("c6a16e8fc28f41ee8dc4502426d5dbc3");

export default {
  fetch: app.fetch,
  hostname: safety.env.HOSTNAME,
  port: safety.env.PORT,
};
