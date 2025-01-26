import { Hono } from "hono";
import error from "../utils/error";

export default class Datarouter {
  public route(app: Hono): void {
    app.all("/api/v1/public/data", (c) => {
      if (c.req.method !== "POST") return error.method(c);
      return c.newResponse("", { status: 204 });
    });
  }
}
