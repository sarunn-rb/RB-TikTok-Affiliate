import { requireReviewerApi } from "@/lib/auth";
import { ensureFreshTikTokSession } from "@/lib/tiktok/auth";
import { tiktokRequest } from "@/lib/tiktok/client";
import { apiErrorResponse } from "@/lib/tiktok/errors";
import { cleanIdentifier, cleanText } from "@/lib/validation";
import { clientAddress, validateSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const rate = rateLimit(`send-message:${clientAddress(request)}`, { limit: 5, windowMs: 30_000 });
  if (!rate.allowed) {
    return Response.json({ error: "Please wait before sending another message." }, {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfter) },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const conversationId = cleanIdentifier(body.conversationId, "Conversation ID");
    const message = cleanText(body.message, { field: "Message", max: 1000 });
    const session = await ensureFreshTikTokSession();
    const response = await tiktokRequest({
      path: `/affiliate_seller/202412/conversations/${conversationId}/messages`,
      method: "POST",
      query: { shop_cipher: session.shop.cipher },
      body: { msg_type: "TEXT", content: JSON.stringify({ content: message }) },
      accessToken: session.accessToken,
    });
    return Response.json({ messageId: response?.data?.message_id || null, requestId: response.request_id });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
