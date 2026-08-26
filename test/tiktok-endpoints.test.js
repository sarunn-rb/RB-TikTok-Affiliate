import test from "node:test";
import assert from "node:assert/strict";
import { CREATOR_SEARCH_ENDPOINT } from "../lib/tiktok/endpoints.js";

test("Creator Marketplace search uses the 202608 API version", () => {
  assert.equal(
    CREATOR_SEARCH_ENDPOINT,
    "/affiliate_seller/202608/marketplace_creators/search",
  );
});
