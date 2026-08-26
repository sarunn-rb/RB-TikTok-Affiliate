import { requireReviewerApi } from "@/lib/auth";
import { ensureFreshTikTokSession } from "@/lib/tiktok/auth";
import { tiktokRequest } from "@/lib/tiktok/client";
import { apiErrorResponse } from "@/lib/tiktok/errors";
import { cleanText } from "@/lib/validation";
import { clientAddress, validateSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { normalizeCreator } from "@/lib/tiktok/creators";
import { CREATOR_SEARCH_ENDPOINT } from "@/lib/tiktok/endpoints";

export async function POST(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const rate = rateLimit(`creator-search:${clientAddress(request)}`, { limit: 12, windowMs: 60_000 });
  if (!rate.allowed) return Response.json({ error: "Please wait before searching again." }, { status: 429 });

  try {
    const body = await request.json().catch(() => ({}));
    const keyword = cleanText(body.keyword, { field: "Search keyword", max: 80 });
    const session = await ensureFreshTikTokSession();
    const response = await tiktokRequest({
      path: CREATOR_SEARCH_ENDPOINT,
      method: "POST",
      query: { shop_cipher: session.shop.cipher, page_size: 20 },
      body: { keyword },
      accessToken: session.accessToken,
    });
    const records = response?.data?.creators || response?.data?.creator_list || response?.data?.marketplace_creators || [];
    const creators = Array.isArray(records) ? records.map(normalizeCreator).filter((item) => item.messageCreatorId) : [];
    return Response.json({
      creators,
      total: response?.data?.total_count ?? creators.length,
      source: {
        endpoint: CREATOR_SEARCH_ENDPOINT,
        requestId: response.request_id || null,
        synchronizedAt: new Date().toISOString(),
        shopId: session.shop.id || null,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
