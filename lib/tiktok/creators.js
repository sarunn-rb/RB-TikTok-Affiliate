function first(source, keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null && source[key] !== "") return source[key];
  }
  return null;
}

function avatarUrl(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const candidate = first(value, ["url", "url_list", "uri"]);
    if (Array.isArray(candidate)) return candidate.find((item) => typeof item === "string") || null;
    return typeof candidate === "string" ? candidate : null;
  }
  return null;
}

export function normalizeCreator(creator) {
  const creatorOpenId = first(creator, ["creator_open_id", "creator_user_open_id", "open_id"]);
  const creatorUserId = first(creator, ["creator_user_id", "creator_id", "id"]);
  const messageCreatorId = creatorOpenId || creatorUserId;

  return {
    messageCreatorId,
    creatorOpenId,
    creatorUserId,
    username: first(creator, ["username", "handle", "creator_username"]),
    name: first(creator, ["nickname", "display_name", "creator_name"]),
    avatar: avatarUrl(first(creator, ["avatar", "avatar_url", "profile_image"])),
    followers: first(creator, ["follower_count", "followers_count", "followers"]),
    category: first(creator, ["category", "content_category", "creator_category"]),
    region: first(creator, ["selection_region", "region", "market", "country_code"]),
  };
}
