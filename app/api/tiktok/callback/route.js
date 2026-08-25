import { NextResponse } from "next/server";
import { buildTikTokSession, exchangeAuthorizationCode } from "@/lib/tiktok/auth";
import { clearOAuthState, getOAuthState, setTikTokSession } from "@/lib/session";

function shopRedirect(request, params) {
  const url = new URL("/shop", request.url);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const stored = await getOAuthState();
  const returnedState = params.get("state");
  const code = params.get("code") || params.get("auth_code");
  const error = params.get("error");

  if (error || !code || code === "null") {
    await clearOAuthState();
    return shopRedirect(request, { error: error === "auth_denied" ? "Authorization was cancelled." : "TikTok Shop did not return an authorization code." });
  }
  if (!stored?.state || !returnedState || stored.state !== returnedState) {
    await clearOAuthState();
    return shopRedirect(request, { error: "OAuth state validation failed. Start the connection again." });
  }

  try {
    await clearOAuthState();
    const tokenData = await exchangeAuthorizationCode(code);
    const session = await buildTikTokSession(tokenData);
    await setTikTokSession(session);
    return shopRedirect(request, { connected: "1" });
  } catch (callbackError) {
    console.error("tiktok_oauth_callback", JSON.stringify({
      message: callbackError instanceof Error ? callbackError.message : "Unknown callback error",
      timestamp: new Date().toISOString(),
    }));
    return shopRedirect(request, { error: "TikTok Shop authorization could not be completed. Check the app configuration and try again." });
  }
}
