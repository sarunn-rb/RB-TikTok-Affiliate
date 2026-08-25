import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

const REVIEW_COOKIE = "rb_review_session";
const TIKTOK_COOKIE = "rb_tiktok_session";
const OAUTH_COOKIE = "rb_tiktok_oauth";
const REVIEW_MAX_AGE = 60 * 60 * 8;
const TIKTOK_MAX_AGE = 60 * 60 * 24 * 7;
const OAUTH_MAX_AGE = 60 * 10;

function encryptionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters.");
  }
  return createHash("sha256").update(secret).digest();
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

async function encrypt(payload, maxAge) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .encrypt(encryptionKey());
}

async function decrypt(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, encryptionKey(), {
      clockTolerance: 5,
    });
    return payload;
  } catch {
    return null;
  }
}

async function readCookie(name) {
  const store = await cookies();
  return decrypt(store.get(name)?.value);
}

async function writeCookie(name, payload, maxAge) {
  const store = await cookies();
  store.set(name, await encrypt(payload, maxAge), cookieOptions(maxAge));
}

async function clearCookie(name) {
  const store = await cookies();
  store.set(name, "", { ...cookieOptions(0), expires: new Date(0) });
}

export const getReviewSession = () => readCookie(REVIEW_COOKIE);
export const setReviewSession = (payload) => writeCookie(REVIEW_COOKIE, payload, REVIEW_MAX_AGE);
export const clearReviewSession = () => clearCookie(REVIEW_COOKIE);

export const getTikTokSession = () => readCookie(TIKTOK_COOKIE);
export const setTikTokSession = (payload) => writeCookie(TIKTOK_COOKIE, payload, TIKTOK_MAX_AGE);
export const clearTikTokSession = () => clearCookie(TIKTOK_COOKIE);

export const getOAuthState = () => readCookie(OAUTH_COOKIE);
export const setOAuthState = (payload) => writeCookie(OAUTH_COOKIE, payload, OAUTH_MAX_AGE);
export const clearOAuthState = () => clearCookie(OAUTH_COOKIE);
