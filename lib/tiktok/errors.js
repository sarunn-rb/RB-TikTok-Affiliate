const BUSINESS_ERRORS = {
  16030001: "This creator is no longer available for messaging.",
  16030002: "This shop has reached its affiliate messaging quota.",
  16030003: "This shop has not met TikTok Shop's Affiliate GMV requirement for creator messaging.",
  16030007: "This TikTok Shop is not currently eligible to message creators.",
  16030009: "TikTok Shop test accounts cannot send affiliate messages.",
  16030100: "This shop has reached the messaging quota for this creator.",
  16030101: "This seller account cannot contact this creator because its status or GMV eligibility does not meet TikTok Shop requirements.",
  16032001: "The creator and seller are registered in different regions.",
  45101004: "The daily TikTok Shop messaging request quota has been reached.",
  45101021: "This creator's privacy settings do not allow this operation.",
  105005: "The connected shop did not grant the API scope required for this action.",
  36009002: "TikTok Shop is receiving too many requests. Wait briefly and try again.",
  36009003: "TikTok Shop returned an internal error. Try again once; contact platform support if it continues.",
  36009009: "The TikTok Shop API path is not available for this application or market.",
  36009010: "TikTok Shop rejected the request method for this API endpoint.",
};

export function friendlyTikTokError(code, fallback) {
  return BUSINESS_ERRORS[Number(code)] || fallback || "TikTok Shop could not complete this request.";
}

export class TikTokApiError extends Error {
  constructor({ code, message, requestId, endpoint, status = 502 }) {
    super(friendlyTikTokError(code, message));
    this.name = "TikTokApiError";
    this.code = code;
    this.requestId = requestId;
    this.endpoint = endpoint;
    this.status = status;
  }
}

export function apiErrorResponse(error) {
  if (error instanceof TikTokApiError) {
    return Response.json(
      { error: error.message, code: error.code, requestId: error.requestId },
      { status: error.status },
    );
  }
  const message = error instanceof Error ? error.message : "Unexpected server error.";
  return Response.json({ error: message }, { status: 400 });
}
