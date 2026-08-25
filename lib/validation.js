export function cleanText(value, { field = "Value", min = 1, max = 200 } = {}) {
  if (typeof value !== "string") throw new Error(`${field} is required.`);
  const text = value.trim();
  if (text.length < min) throw new Error(`${field} is required.`);
  if (text.length > max) throw new Error(`${field} must be ${max} characters or fewer.`);
  return text;
}

export function cleanIdentifier(value, field = "Identifier") {
  const text = cleanText(value, { field, max: 256 });
  if (!/^[A-Za-z0-9_\-]+$/.test(text)) throw new Error(`${field} contains unsupported characters.`);
  return text;
}
