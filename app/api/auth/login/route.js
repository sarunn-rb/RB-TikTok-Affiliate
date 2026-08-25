import { clientAddress, validateSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { setReviewSession } from "@/lib/session";
import { validateReviewerCredentials } from "@/lib/auth";

export async function POST(request) {
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const rate = rateLimit(`login:${clientAddress(request)}`, { limit: 6, windowMs: 10 * 60_000 });
  if (!rate.allowed) {
    return Response.json({ error: "Too many login attempts. Please wait and try again." }, {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfter) },
    });
  }

  const body = await request.json().catch(() => ({}));
  if (!validateReviewerCredentials(body.username, body.password)) {
    return Response.json({ error: "The reviewer username or password is incorrect." }, { status: 401 });
  }
  await setReviewSession({ role: "reviewer", username: String(body.username), authenticatedAt: Date.now() });
  return Response.json({ ok: true });
}
