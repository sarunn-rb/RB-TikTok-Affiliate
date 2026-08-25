import { clearOAuthState, clearReviewSession, clearTikTokSession } from "@/lib/session";
import { validateSameOrigin } from "@/lib/security";

export async function POST(request) {
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  await Promise.all([clearReviewSession(), clearTikTokSession(), clearOAuthState()]);
  return Response.json({ ok: true });
}
