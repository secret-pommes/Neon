import { Hono } from "hono";
import fs from "node:fs";
import path from "node:path";
import log from "./log";

type RouteClass = {
  new (): { route(app: Hono): void };
};

class Loader {
  private async load(
    filePath: string,
    prefix: string,
    app: Hono
  ): Promise<void> {
    try {
      const module = await import(filePath.replace(/\\/g, "/"));
      const RouteClass: RouteClass | undefined = module.default;

      if (RouteClass) {
        const subApp = new Hono({ strict: false });
        const routeInstance = new RouteClass();
        routeInstance.route(subApp);
        app.route(prefix, subApp);
        log.info(`Loaded ${filePath} as ${prefix}`);
      } else {
        log.error(`Failed to load ${filePath}`);
      }
    } catch (e) {
      log.error(`Error loading ${filePath}: ${e}`);
    }
  }

  public async register(dir: string, app: Hono): Promise<void> {
    try {
      const files = fs.readdirSync(dir);
      const routeFiles = files.filter((file) => file.endsWith(".ts"));

      for (const file of routeFiles) {
        const filePath = path.join(dir, file);
        const { name } = path.parse(filePath);
        const prefix = `/${name}`;
        await this.load(filePath, prefix, app);
      }
    } catch (e) {
      log.error(`Error registering routes from ${dir}: ${e}`);
    }
  }
}

export default new Loader();
