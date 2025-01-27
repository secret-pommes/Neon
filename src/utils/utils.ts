import { Context } from "hono";
import { z } from "zod";
import crypto from "node:crypto";
import { ClientInfo, FNVer } from "../types/types";

class Utils {
  public getId(): string {
    return crypto.randomUUID().replace(/-/g, "");
  }

  public getUUID(): string {
    return crypto.randomUUID();
  }

  public decodeBase64(c: string): string {
    return Buffer.from(c, "base64").toString("utf-8");
  }

  public FNVer(c: Context): FNVer {
    let final: FNVer = {
      seasonInt: 0,
      seasonStr: "0",
      versionInt: 0,
      versionStr: "0",
    };

    const headerObj = z.object({
      "user-agent": z.string(),
    });

    const { success, data } = headerObj.safeParse(c.req.header());
    if (!success) return final;

    // works from like 3.0?
    final.seasonInt = Number(data["user-agent"].split("-")[1].split(".")[0]);
    final.seasonStr = data["user-agent"].split("-")[1].split(".")[0];
    final.versionInt = Number(data["user-agent"].split("-")[1].split("-")[0]);
    final.versionStr = data["user-agent"].split("-")[1].split("-")[0];

    return final;
  }

  public ClientInfo(c: Context): ClientInfo {
    let final: ClientInfo = {
      platform: "win",
      NT: "0",
    };

    const headerObj = z.object({
      "user-agent": z.string(),
    });

    const { success, data } = headerObj.safeParse(c.req.header());
    if (!success) return final;

    final.platform = data["user-agent"].split(" ")[1].split("/")[0];
    final.NT =
      final.platform.toLowerCase() === "windows"
        ? `${data["user-agent"].split("/")[2].split(".")[0]}.${
            data["user-agent"].split("/")[2].split(".")[1]
          }`
        : "0";

    return final;
  }

  public EndOfDayISOString(): string {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }
}

export default new Utils();
