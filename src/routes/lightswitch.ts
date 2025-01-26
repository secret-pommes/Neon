import { Hono } from "hono";
import { z } from "zod";
import error from "../utils/error";
import token from "../utils/token";
import { AccessTokenT } from "../types/types";

export default class Lightswitch {
  public route(app: Hono): void {
    app.all("/api/service/Fortnite/status", token.VerifyToken, (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const headerObj = z.object({
        authorization: z.string(),
      });

      const headerRes = headerObj.safeParse(c.req.header());
      if (!headerRes.success) return error.validation(c);
      const dt: AccessTokenT = token.decode(
        headerRes.data.authorization.split("~")[1]
      );
      if (!dt) return error.authFailed(c, "lightswitch");

      return c.json({
        serviceInstanceId: "fortnite",
        status: "UP",
        message: "",
        maintenanceUri: null,
        overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
        allowedActions: [],
        banned: dt.account.bnd,
        launcherInfoDTO: {
          appName: "Fortnite",
          catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
          namespace: "fn",
        },
      });
    });

    app.all("/api/service/bulk/status", token.VerifyToken, (c) => {
      if (c.req.method !== "GET") return error.method(c);
      const headerObj = z.object({
        authorization: z.string(),
      });

      const headerRes = headerObj.safeParse(c.req.header());
      if (!headerRes.success) return error.validation(c);
      const dt: AccessTokenT = token.decode(
        headerRes.data.authorization.split("~")[1]
      );
      if (!dt) return error.authFailed(c, "lightswitch");

      return c.json([
        {
          serviceInstanceId: "fortnite",
          status: "UP",
          message: "",
          maintenanceUri: null,
          overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
          allowedActions: ["PLAY", "DOWNLOAD"],
          banned: dt.account.bnd,
          launcherInfoDTO: {
            appName: "Fortnite",
            catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
            namespace: "fn",
          },
        },
      ]);
    });
  }
}
