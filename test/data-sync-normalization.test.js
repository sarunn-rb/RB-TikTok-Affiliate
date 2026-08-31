import test from "node:test";
import assert from "node:assert/strict";
import { normalizeOrders, normalizeProducts } from "../lib/tiktok/data-sync.js";

test("preserves exact TikTok Product IDs and safe basic fields", () => {
  const products = normalizeProducts([{ id: "1729384756102938475", title: "Rabbit product", status: "ACTIVATE", create_time: 1700000000, update_time: "1700000100" }, { title: "Missing ID" }]);
  assert.deepEqual(products, [{ id: "1729384756102938475", title: "Rabbit product", status: "ACTIVATE", createTime: 1700000000, updateTime: 1700000100 }]);
});

test("preserves exact TikTok Order IDs without exposing buyer fields", () => {
  const orders = normalizeOrders([{ id: "576123456789012345", status: "UNPAID", create_time: 1700000000, update_time: 1700000100, is_sample_order: true, buyer_email: "private@example.com", recipient_address: { name: "Private" } }]);
  assert.deepEqual(orders, [{ id: "576123456789012345", status: "UNPAID", createTime: 1700000000, updateTime: 1700000100, isSampleOrder: true }]);
  assert.equal("buyer_email" in orders[0], false);
  assert.equal("recipient_address" in orders[0], false);
});
