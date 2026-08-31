import test from "node:test";
import assert from "node:assert/strict";
import { CREATOR_SEARCH_ENDPOINT, ORDER_SEARCH_ENDPOINT, PRODUCT_SEARCH_ENDPOINT } from "../lib/tiktok/endpoints.js";

test("Creator Marketplace search uses the 202608 API version", () => {
  assert.equal(
    CREATOR_SEARCH_ENDPOINT,
    "/affiliate_seller/202608/marketplace_creators/search",
  );
});

test("Data Sync uses the documented Product and Order API versions", () => {
  assert.equal(PRODUCT_SEARCH_ENDPOINT, "/product/202502/products/search");
  assert.equal(ORDER_SEARCH_ENDPOINT, "/order/202309/orders/search");
});
