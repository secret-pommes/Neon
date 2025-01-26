import type { Context } from "hono";
import { ContentfulStatusCode } from "hono/dist/types/utils/http-status";

// not proper. but ok :)
class Error {
  private send(
    c: Context,
    errorCode: string = "errors.com.epicgames.common.bad_request",
    errorMessage: string = "The client is not configured correctly. Please make sure it is associated with an Application.",
    messageVars: string[] = [],
    numericErrorCode: number = 1012,
    originatingService: string = "unknown",
    intent: string = "prod-live",
    status: ContentfulStatusCode = 400
  ): Response {
    return c.json(
      {
        errorCode,
        errorMessage,
        messageVars,
        numericErrorCode,
        originatingService,
        intent,
      },
      status,
      {
        "X-Epic-Error-Name": errorCode,
        "X-Epic-Error-Code": numericErrorCode.toString(),
      }
    );
  }

  public notFound(
    c: Context,
    originatingService: string = "fortnite"
  ): Response {
    return this.send(
      c,
      `errors.com.epicgames.${c.req.path.split("/")[1] || "common"}.not_found`,
      "Sorry the resource you were trying to find could not be found",
      [c.req.path],
      1014,
      originatingService,
      "prod-live",
      404
    );
  }

  public method(c: Context, originatingService: string = "fortnite"): Response {
    return this.send(
      c,
      `errors.com.epicgames.${c.req.path.split("/")[1]}.method_not_allowed`,
      "Sorry the resource you were trying to access cannot be accessed with the HTTP method you used.",
      [c.req.path],
      1015,
      originatingService,
      "prod-live",
      405
    );
  }

  public validation(
    c: Context,
    originatingService: string = "fortnite"
  ): Response {
    return this.send(
      c,
      "errors.com.epicgames.validation.validation_failed",
      "Validation failed",
      [c.req.path],
      1015,
      originatingService,
      "prod-live",
      403
    );
  }

  public invalidClient(
    c: Context,
    originatingService: string = "fortnite"
  ): Response {
    return this.send(
      c,
      "errors.com.epicgames.common.oauth.invalid_client",
      "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
      [c.req.path],
      1011,
      originatingService,
      "prod-live",
      403
    );
  }

  public invalidCredentials(
    c: Context,
    originatingService: string = "fortnite"
  ): Response {
    return this.send(
      c,
      "errors.com.epicgames.account.invalid_account_credentials",
      "Your e-mail and/or password are incorrect. Please check them and try again.",
      [c.req.path],
      1012,
      originatingService,
      "prod-live",
      400
    );
  }

  public invalidOAuthRequest(
    c: Context,
    originatingService: string = "fortnite",
    message: string = "Missing Parameter"
  ): Response {
    return this.send(
      c,
      "errors.com.epicgames.common.oauth.invalid_request",
      message,
      [c.req.path],
      1013,
      originatingService,
      "prod-live",
      400
    );
  }

  public authFailed(
    c: Context,
    originatingService: string = "fortnite"
  ): Response {
    return this.send(
      c,
      `errors.com.epicgames.${originatingService}.authorization.authorization_failed`,
      `Authorization failed for ${c.req.path}`,
      [c.req.path],
      1016,
      originatingService,
      "prod-live",
      401
    );
  }
}

export default new Error();
