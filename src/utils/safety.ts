import { z } from "zod";
import "dotenv/config";

const safetyObj = z.object({
  HOSTNAME: z.string(),
  PORT: z.number(),
  MONGO_URI: z.string(),
  MONGO_USR: z.string(),
  MONGO_PWD: z.string(),
  MONGO_DB: z.string(),
  JWT_SECRET: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.number(),
  REDIS_DB: z.number(),
});

class Safety {
  private data = safetyObj.parse({
    HOSTNAME: process.env.HOSTNAME,
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 1000,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_USR: process.env.MONGO_USR || "",
    MONGO_PWD: process.env.MONGO_PWD || "",
    MONGO_DB: process.env.MONGO_DB,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT)
      : 6379,
    REDIS_DB: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  });

  public env: z.infer<typeof safetyObj> = {
    HOSTNAME: this.data.HOSTNAME,
    PORT: this.data.PORT,
    MONGO_URI: this.data.MONGO_URI,
    MONGO_USR: this.data.MONGO_USR,
    MONGO_PWD: this.data.MONGO_PWD,
    MONGO_DB: this.data.MONGO_DB,
    JWT_SECRET: this.data.JWT_SECRET,
    REDIS_HOST: this.data.REDIS_HOST,
    REDIS_PORT: this.data.REDIS_PORT,
    REDIS_DB: this.data.REDIS_DB,
  };
}

export default new Safety();
