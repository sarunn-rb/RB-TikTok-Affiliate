import { requireReviewerApi } from "@/lib/auth";
import { ensureFreshTikTokSession } from "@/lib/tiktok/auth";
import { tiktokRequest } from "@/lib/tiktok/client";
import { apiErrorResponse } from "@/lib/tiktok/errors";
import { cleanIdentifier } from "@/lib/validation";
import { clientAddress, validateSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const rate = rateLimit(`conversation:${clientAddress(request)}`, { limit: 8, windowMs: 60_000 });
  if (!rate.allowed) return Response.json({ error: "Please wait before starting another conversation." }, { status: 429 });

  try {
    const body = await request.json().catch(() => ({}));
    const creatorOpenId = cleanIdentifier(body.creatorOpenId, "Creator Open ID");
    const session = await ensureFreshTikTokSession();
    const response = await tiktokRequest({
      path: "/affiliate_seller/202508/conversations",
      method: "POST",
      query: { shop_cipher: session.shop.cipher },
      body: { creator_open_id: creatorOpenId, only_need_conversation_id: true },
      accessToken: session.accessToken,
    });
    const conversationId = response?.data?.conversation_id || response?.data?.conversation?.conversation_id;
    if (!conversationId) throw new Error("TikTok Shop did not return a conversation ID.");
    return Response.json({ conversationId, isNew: Boolean(response?.data?.is_new), requestId: response.request_id });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
