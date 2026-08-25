import { createHmac } from "node:crypto";

const EXCLUDED_KEYS = new Set(["access_token", "sign"]);

export function generateTikTokSign({ path, query = {}, body = "", contentType = "application/json", secret }) {
  const parameters = Object.keys(query)
    .filter((key) => !EXCLUDED_KEYS.has(key) && query[key] !== undefined && query[key] !== null)
    .sort()
    .map((key) => `${key}${query[key]}`)
    .join("");

  let signString = `${path}${parameters}`;
  if (!contentType.startsWith("multipart/form-data") && body) signString += body;
  const wrapped = `${secret}${signString}${secret}`;
  return createHmac("sha256", secret).update(wrapped).digest("hex");
}
