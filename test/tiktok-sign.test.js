import assert from "node:assert/strict";
import test from "node:test";
import { generateTikTokSign } from "../lib/tiktok/sign.js";

test("matches TikTok Shop's documented Get Authorized Shops signature fixture", () => {
  const sign = generateTikTokSign({
    path: "/authorization/202309/shops",
    query: { app_key: "29a39d", timestamp: 1623812664 },
    secret: "e59af819cc",
  });

  assert.equal(sign, "b596b73e0cc6de07ac26f036364178ab16b0a907af13d43f0a0cd2345f582dc8");
});

test("excludes sign and access_token and signs the exact JSON body", () => {
  const shared = {
    path: "/affiliate_seller/202508/conversations",
    secret: "test-secret",
  };
  const first = generateTikTokSign({
    ...shared,
    query: { timestamp: 100, app_key: "key", sign: "ignored", access_token: "ignored" },
    body: '{"creator_open_id":"abc","only_need_conversation_id":true}',
  });
  const second = generateTikTokSign({
    ...shared,
    query: { app_key: "key", timestamp: 100 },
    body: '{"creator_open_id":"abc","only_need_conversation_id":true}',
  });

  assert.equal(first, second);
  assert.notEqual(first, generateTikTokSign({ ...shared, query: { app_key: "key", timestamp: 100 }, body: '{"only_need_conversation_id":true,"creator_open_id":"abc"}' }));
});
