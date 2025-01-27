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
  DISCORD_REDIRECT_URI: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_GUILD_ID: z.string(),
  DISCORD_URI: z.string(),
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
    DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
    DISCORD_URI: process.env.DISCORD_URI
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
    DISCORD_REDIRECT_URI: this.data.DISCORD_REDIRECT_URI,
    DISCORD_CLIENT_ID: this.data.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: this.data.DISCORD_CLIENT_SECRET,
    DISCORD_GUILD_ID: this.data.DISCORD_GUILD_ID,
    DISCORD_URI: this.data.DISCORD_URI
  };
}

export default new Safety();
