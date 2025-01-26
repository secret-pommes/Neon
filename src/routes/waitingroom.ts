import { Hono } from "hono";
import error from "../utils/error";

export default class Waitingroom {
  public route(app: Hono): void {
    app.all("/api/waitingroom", (c) => {
      if (c.req.method !== "GET") return error.method(c);
      return c.newResponse("", { status: 204 });
    });
  }
}
