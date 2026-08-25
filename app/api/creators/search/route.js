import { requireReviewerApi } from "@/lib/auth";
import { ensureFreshTikTokSession } from "@/lib/tiktok/auth";
import { tiktokRequest } from "@/lib/tiktok/client";
import { apiErrorResponse } from "@/lib/tiktok/errors";
import { cleanText } from "@/lib/validation";
import { clientAddress, validateSameOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

function first(source, keys) {
  for (const key of keys) if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  return null;
}

function normalizeCreator(creator) {
  const openId = first(creator, ["creator_open_id", "creator_user_open_id", "creator_user_id", "open_id"]);
  return {
    openId,
    username: first(creator, ["username", "handle", "creator_username"]),
    name: first(creator, ["nickname", "display_name", "creator_name"]),
    avatar: first(creator, ["avatar", "avatar_url", "profile_image"]),
    followers: first(creator, ["follower_count", "followers_count", "followers"]),
    category: first(creator, ["category", "content_category", "creator_category"]),
    region: first(creator, ["region", "market", "country_code"]),
  };
}

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
      path: "/affiliate_seller/202505/marketplace_creators/search",
      method: "POST",
      query: { shop_cipher: session.shop.cipher, page_size: 20 },
      body: { keyword },
      accessToken: session.accessToken,
    });
    const records = response?.data?.creators || response?.data?.creator_list || response?.data?.marketplace_creators || [];
    const creators = Array.isArray(records) ? records.map(normalizeCreator).filter((item) => item.openId) : [];
    return Response.json({ creators, total: response?.data?.total_count ?? creators.length, requestId: response.request_id });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
