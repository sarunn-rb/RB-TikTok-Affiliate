import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { getReviewSession } from "@/lib/session";

function safeEqual(left = "", right = "") {
  const a = createHash("sha256").update(String(left)).digest();
  const b = createHash("sha256").update(String(right)).digest();
  return timingSafeEqual(a, b);
}

export function validateReviewerCredentials(username, password) {
  const expectedUser = process.env.REVIEW_USER;
  const expectedPassword = process.env.REVIEW_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}

export async function isReviewerAuthenticated() {
  const session = await getReviewSession();
  return session?.role === "reviewer" && typeof session?.username === "string";
}

export async function requireReviewerApi() {
  if (!(await isReviewerAuthenticated())) {
    return Response.json({ error: "Your reviewer session has expired. Please log in again." }, { status: 401 });
  }
  return null;
}
