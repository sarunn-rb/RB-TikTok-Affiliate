import { requireReviewerApi } from "@/lib/auth";
import { clearTikTokSession } from "@/lib/session";
import { validateSameOrigin } from "@/lib/security";

export async function POST(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  await clearTikTokSession();
  return Response.json({ ok: true });
}
