import { requireReviewerApi } from "@/lib/auth";
import { validateSameOrigin } from "@/lib/security";
import { getTikTokSession, setTikTokSession } from "@/lib/session";

export async function POST(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const index = Number(body.index);
  const session = await getTikTokSession();
  const shops = session?.shops || (session?.shop ? [session.shop] : []);
  if (!Number.isInteger(index) || index < 0 || index >= shops.length) {
    return Response.json({ error: "Select an authorized TikTok Shop." }, { status: 400 });
  }
  await setTikTokSession({ ...session, shop: shops[index] });
  return Response.json({ ok: true });
}
