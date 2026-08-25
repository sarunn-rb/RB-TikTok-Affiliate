import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireReviewerApi } from "@/lib/auth";
import { setOAuthState } from "@/lib/session";

export async function GET(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;

  const serviceId = process.env.TIKTOK_SHOP_SERVICE_ID;
  if (!serviceId) {
    return Response.json({ error: "TIKTOK_SHOP_SERVICE_ID is not configured." }, { status: 503 });
  }

  const requestedMarket = new URL(request.url).searchParams.get("market")?.toUpperCase();
  const market = requestedMarket === "US" ? "US" : (process.env.TIKTOK_SHOP_MARKET || "ROW").toUpperCase();
  const state = randomBytes(32).toString("base64url");
  await setOAuthState({ state, market, createdAt: Date.now() });

  const origin = market === "US"
    ? "https://services.us.tiktokshop.com"
    : "https://services.tiktokshop.com";
  const authorizeUrl = new URL("/open/authorize", origin);
  authorizeUrl.searchParams.set("service_id", serviceId);
  authorizeUrl.searchParams.set("state", state);
  return NextResponse.redirect(authorizeUrl);
}
