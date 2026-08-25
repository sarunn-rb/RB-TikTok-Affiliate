import "server-only";

import { getTikTokSession, setTikTokSession } from "@/lib/session";
import { tiktokRequest } from "@/lib/tiktok/client";

const TOKEN_ORIGIN = "https://auth.tiktok-shops.com";

function requiredCredentials() {
  const appKey = process.env.TIKTOK_SHOP_APP_KEY;
  const appSecret = process.env.TIKTOK_SHOP_APP_SECRET;
  if (!appKey || !appSecret) throw new Error("TIKTOK_SHOP_APP_KEY and TIKTOK_SHOP_APP_SECRET are required.");
  return { appKey, appSecret };
}

function tokenExpiry(data) {
  const seconds = Number(data.access_token_expire_in || data.access_token_expire || data.expire_in || 0);
  return seconds > 0 ? Date.now() + seconds * 1000 : null;
}

function refreshExpiry(data) {
  const seconds = Number(data.refresh_token_expire_in || data.refresh_token_expire || 0);
  return seconds > 0 ? Date.now() + seconds * 1000 : null;
}

function normalizeScopes(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(/[ ,]+/).filter(Boolean);
  return [];
}

async function tokenRequest(path, params) {
  const { appKey, appSecret } = requiredCredentials();
  const url = new URL(path, TOKEN_ORIGIN);
  url.search = new URLSearchParams({ app_key: appKey, app_secret: appSecret, ...params });
  const response = await fetch(url, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(15_000) });
  const payload = await response.json().catch(() => ({}));
  const data = payload.data || payload;
  if (!response.ok || !data.access_token) {
    throw new Error(payload.message || data.message || "TikTok Shop token exchange failed.");
  }
  return data;
}

export async function exchangeAuthorizationCode(authCode) {
  return tokenRequest("/api/v2/token/get", { auth_code: authCode, grant_type: "authorized_code" });
}

export async function refreshAccessToken(refreshToken) {
  return tokenRequest("/api/v2/token/refresh", { refresh_token: refreshToken, grant_type: "refresh_token" });
}

export async function buildTikTokSession(tokenData) {
  const shopsResponse = await tiktokRequest({
    path: "/authorization/202309/shops",
    accessToken: tokenData.access_token,
  });
  const shops = shopsResponse?.data?.shops || [];
  const authorizedShops = shops.map((shop) => ({
    id: shop.id || null,
    cipher: shop.cipher,
    code: shop.code || null,
    name: shop.name || "TikTok Shop",
    region: shop.region || shop.market || null,
    sellerType: shop.seller_type || null,
  })).filter((shop) => shop.cipher);
  const shop = authorizedShops[0];
  if (!shop?.cipher) throw new Error("TikTok Shop authorization succeeded but no authorized shop was returned.");
  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token || null,
    accessTokenExpiresAt: tokenExpiry(tokenData),
    refreshTokenExpiresAt: refreshExpiry(tokenData),
    scopes: normalizeScopes(tokenData.granted_scopes || tokenData.scope),
    shop,
    shops: authorizedShops,
    connectedAt: Date.now(),
  };
}

export async function ensureFreshTikTokSession() {
  const session = await getTikTokSession();
  if (!session?.accessToken || !session?.shop?.cipher) throw new Error("Connect a TikTok Shop before using this feature.");
  const expiresSoon = session.accessTokenExpiresAt && session.accessTokenExpiresAt < Date.now() + 5 * 60 * 1000;
  if (!expiresSoon) return session;
  if (!session.refreshToken) throw new Error("The TikTok Shop access token expired. Reconnect the shop to continue.");

  const refreshed = await refreshAccessToken(session.refreshToken);
  const nextSession = {
    ...session,
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token || session.refreshToken,
    accessTokenExpiresAt: tokenExpiry(refreshed),
    refreshTokenExpiresAt: refreshExpiry(refreshed) || session.refreshTokenExpiresAt,
    scopes: normalizeScopes(refreshed.granted_scopes || refreshed.scope).length
      ? normalizeScopes(refreshed.granted_scopes || refreshed.scope)
      : session.scopes,
  };
  await setTikTokSession(nextSession);
  return nextSession;
}

export function hasScope(session, scope) {
  return Array.isArray(session?.scopes) && session.scopes.includes(scope);
}

export function publicConnection(session) {
  if (!session?.shop) return { connected: false, scopes: [] };
  const cipher = session.shop.cipher || "";
  return {
    connected: true,
    shop: {
      id: session.shop.id,
      name: session.shop.name,
      region: session.shop.region,
      sellerType: session.shop.sellerType,
      maskedCipher: cipher.length > 12 ? `${cipher.slice(0, 6)}••••••${cipher.slice(-4)}` : "••••••••",
    },
    scopes: session.scopes || [],
    authorizedShops: (session.shops || [session.shop]).map((shop, index) => ({
      index,
      id: shop.id,
      name: shop.name,
      region: shop.region,
      sellerType: shop.sellerType,
      selected: shop.cipher === session.shop.cipher,
    })),
    accessTokenExpiresAt: session.accessTokenExpiresAt || null,
    connectedAt: session.connectedAt || null,
  };
}
