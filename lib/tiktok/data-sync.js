function identifier(value) {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function unixTime(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
}

export function normalizeProduct(record = {}) {
  return {
    id: identifier(record.id),
    title: typeof record.title === "string" && record.title.trim() ? record.title.trim() : null,
    status: typeof record.status === "string" && record.status ? record.status : record.audit?.status || null,
    createTime: unixTime(record.create_time),
    updateTime: unixTime(record.update_time),
  };
}

export function normalizeOrder(record = {}) {
  return {
    id: identifier(record.id),
    status: typeof record.status === "string" && record.status ? record.status : null,
    createTime: unixTime(record.create_time),
    updateTime: unixTime(record.update_time),
    isSampleOrder: typeof record.is_sample_order === "boolean" ? record.is_sample_order : null,
  };
}

export function normalizeProducts(records) {
  return Array.isArray(records) ? records.map(normalizeProduct).filter((record) => record.id) : [];
}

export function normalizeOrders(records) {
  return Array.isArray(records) ? records.map(normalizeOrder).filter((record) => record.id) : [];
}
