import "server-only";

import { generateTikTokSign } from "@/lib/tiktok/sign";
import { TikTokApiError } from "@/lib/tiktok/errors";

const API_ORIGIN = "https://open-api.tiktokglobalshop.com";

function credentials() {
  const appKey = process.env.TIKTOK_SHOP_APP_KEY;
  const appSecret = process.env.TIKTOK_SHOP_APP_SECRET;
  if (!appKey || !appSecret) throw new Error("TIKTOK_SHOP_APP_KEY and TIKTOK_SHOP_APP_SECRET are required.");
  return { appKey, appSecret };
}

function logResult(endpoint, payload) {
  console.info("tiktok_api", JSON.stringify({
    endpoint,
    request_id: payload?.request_id || null,
    code: payload?.code ?? null,
    message: payload?.message || null,
    timestamp: new Date().toISOString(),
  }));
}

export async function tiktokRequest({ path, method = "GET", query = {}, body, accessToken }) {
  const { appKey, appSecret } = credentials();
  const timestamp = Math.floor(Date.now() / 1000);
  const bodyText = body === undefined ? "" : JSON.stringify(body);
  const signedQuery = { ...query, app_key: appKey, timestamp };
  const sign = generateTikTokSign({ path, query: signedQuery, body: bodyText, secret: appSecret });
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...signedQuery, sign })) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }

  let response;
  try {
    response = await fetch(`${API_ORIGIN}${path}?${search}`, {
      method,
      headers: {
        "content-type": "application/json",
        "x-tts-access-token": accessToken,
      },
      body: bodyText || undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new TikTokApiError({ endpoint: path, message: "TikTok Shop did not respond in time.", status: 504 });
  }

  const payload = await response.json().catch(() => ({}));
  logResult(path, payload);
  if (!response.ok || Number(payload.code) !== 0) {
    throw new TikTokApiError({
      endpoint: path,
      code: payload.code || response.status,
      message: payload.message || `TikTok Shop returned HTTP ${response.status}.`,
      requestId: payload.request_id,
      status: response.ok ? 422 : 502,
    });
  }
  return payload;
}
