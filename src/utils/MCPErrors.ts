import { Context } from "hono";

class MCPError {
  private send(
    errorCode: string = "errors.com.epicgames.common.bad_request",
    errorMessage: string = "The client is not configured correctly. Please make sure it is associated with an Application.",
    messageVars: string[] = [],
    numericErrorCode: number = 1012,
    originatingService: string = "unknown",
    intent: string = "prod-live"
  ): object {
    return {
      errorCode,
      errorMessage,
      messageVars,
      numericErrorCode,
      originatingService,
      intent,
    };
  }

  public notFound(c: Context, originatingService: string = "fortnite"): object {
    return this.send(
      "errors.com.epicgames.modules.not_found",
      "Sorry the resource you were trying to find could not be found",
      [c.req.path],
      1014,
      originatingService,
      "prod-live"
    );
  }

  public validation(
    c: Context,
    originatingService: string = "fortnite"
  ): object {
    return this.send(
      "errors.com.epicgames.modules.validation.validation_failed",
      "Validation failed",
      [c.req.path],
      1015,
      originatingService,
      "prod-live"
    );
  }

  public authFailed(c: Context): object {
    return this.send(
      "errors.com.epicgames.modules.authorization.authorization_failed",
      `Authorization failed for ${c.req.path}`,
      [c.req.path],
      1016,
      "modules",
      "prod-live"
    );
  }

  public profileNotFound(command: string, profileId: string): object {
    return this.send(
      "errors.com.epicgames.modules.profiles.invalid_command",
      `${command} is not valid on ${profileId} profile`,
      [command, profileId],
      12801,
      "modules",
      "prod-live"
    );
  }
}

export default new MCPError();
