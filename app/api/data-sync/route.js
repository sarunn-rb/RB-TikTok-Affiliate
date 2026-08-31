import { requireReviewerApi } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { clientAddress, validateSameOrigin } from "@/lib/security";
import { ensureFreshTikTokSession } from "@/lib/tiktok/auth";
import { tiktokRequest } from "@/lib/tiktok/client";
import { normalizeOrders, normalizeProducts } from "@/lib/tiktok/data-sync";
import { ORDER_SEARCH_ENDPOINT, PRODUCT_SEARCH_ENDPOINT } from "@/lib/tiktok/endpoints";
import { apiErrorResponse, TikTokApiError } from "@/lib/tiktok/errors";

function failedDataset(error, endpoint, fallback) {
  if (error instanceof TikTokApiError) {
    return {
      items: [],
      total: null,
      source: { endpoint, requestId: error.requestId || null },
      error: { message: error.message, code: error.code || null },
    };
  }
  console.error("tiktok_data_sync", JSON.stringify({ endpoint, message: fallback, timestamp: new Date().toISOString() }));
  return {
    items: [],
    total: null,
    source: { endpoint, requestId: null },
    error: { message: fallback, code: null },
  };
}

async function syncProducts(session) {
  try {
    const response = await tiktokRequest({
      path: PRODUCT_SEARCH_ENDPOINT,
      method: "POST",
      query: { shop_cipher: session.shop.cipher, page_size: 20 },
      body: { status: "ALL" },
      accessToken: session.accessToken,
    });
    const items = normalizeProducts(response?.data?.products);
    return {
      items,
      total: response?.data?.total_count ?? items.length,
      source: { endpoint: PRODUCT_SEARCH_ENDPOINT, requestId: response.request_id || null },
      error: null,
    };
  } catch (error) {
    return failedDataset(error, PRODUCT_SEARCH_ENDPOINT, "TikTok Shop product data could not be retrieved.");
  }
}

async function syncOrders(session) {
  try {
    const response = await tiktokRequest({
      path: ORDER_SEARCH_ENDPOINT,
      method: "POST",
      query: {
        shop_cipher: session.shop.cipher,
        page_size: 20,
        sort_field: "create_time",
        sort_order: "DESC",
      },
      body: {},
      accessToken: session.accessToken,
    });
    const items = normalizeOrders(response?.data?.orders);
    return {
      items,
      total: response?.data?.total_count ?? items.length,
      source: { endpoint: ORDER_SEARCH_ENDPOINT, requestId: response.request_id || null },
      error: null,
    };
  } catch (error) {
    return failedDataset(error, ORDER_SEARCH_ENDPOINT, "TikTok Shop order data could not be retrieved.");
  }
}

export async function POST(request) {
  const unauthorized = await requireReviewerApi();
  if (unauthorized) return unauthorized;
  if (!validateSameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });

  const rate = rateLimit(`data-sync:${clientAddress(request)}`, { limit: 6, windowMs: 60_000 });
  if (!rate.allowed) {
    return Response.json({ error: "Please wait before synchronizing TikTok Shop data again." }, {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfter) },
    });
  }

  try {
    const session = await ensureFreshTikTokSession();
    const synchronizedAt = new Date().toISOString();
    const [products, orders] = await Promise.all([syncProducts(session), syncOrders(session)]);

    return Response.json({
      shopId: session.shop.id || null,
      synchronizedAt,
      products,
      orders,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
