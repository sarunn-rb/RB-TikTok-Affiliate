import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCreator } from "../lib/tiktok/creators.js";

test("preserves TikTok Creator User ID and Creator Open ID as separate fields", () => {
  const creator = normalizeCreator({
    creator_user_id: "7491234567890123456",
    creator_open_id: "uACafQAAAABmUU2qon4R0vUYvUVS3QC6",
    username: "rabbitcreator",
    nickname: "Rabbit Creator",
    avatar: { url: "https://example.com/avatar.webp" },
    selection_region: "TH",
    follower_count: 1200,
  });

  assert.equal(creator.creatorUserId, "7491234567890123456");
  assert.equal(creator.creatorOpenId, "uACafQAAAABmUU2qon4R0vUYvUVS3QC6");
  assert.equal(creator.messageCreatorId, creator.creatorOpenId);
  assert.equal(creator.avatar, "https://example.com/avatar.webp");
  assert.equal(creator.region, "TH");
});

test("keeps an API-provided creator_user_id usable when no separate open ID is returned", () => {
  const creator = normalizeCreator({
    creator_user_id: "uACafQAAAABmUU2qon4R0vUYvUVS3QC6",
    avatar: { url_list: ["https://example.com/avatar.webp"] },
  });

  assert.equal(creator.creatorOpenId, null);
  assert.equal(creator.creatorUserId, "uACafQAAAABmUU2qon4R0vUYvUVS3QC6");
  assert.equal(creator.messageCreatorId, creator.creatorUserId);
  assert.equal(creator.avatar, "https://example.com/avatar.webp");
});
