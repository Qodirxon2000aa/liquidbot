/** PHP oldi/oxirida chiqindi bo‘lsa ham JSON objectni ajratib parse qiladi */

function stripBomAndTrim(text) {
  return String(text).replace(/^\uFEFF/, '').trimStart();
}

function tryParseBalancedObject(text, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        const chunk = text.slice(start, i + 1);
        try {
          return JSON.parse(chunk);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/**
 * Matndan bir yoki bir nechta `{...}` dan birinchisini emas, har birini sinab,
 * to‘g‘ri JSON bo‘lganini qaytaradi (prefixda noto‘g‘ri `{` bo‘lsa ham).
 */
export function parseJsonMaybeLeadingNoise(text) {
  if (text == null || typeof text !== 'string') return null;
  const normalized = stripBomAndTrim(text);
  if (!normalized) return null;

  let searchFrom = 0;
  while (searchFrom < normalized.length) {
    const start = normalized.indexOf('{', searchFrom);
    if (start < 0) return null;

    try {
      return JSON.parse(normalized.slice(start));
    } catch {
      /* continue */
    }

    const fromBraces = tryParseBalancedObject(normalized, start);
    if (fromBraces && typeof fromBraces === 'object') {
      return fromBraces;
    }

    searchFrom = start + 1;
  }
  return null;
}

/**
 * JSON.parse butunlay yiqilganda ham, server muvaffaqiyat javobini matndan aniqlash.
 */
export function parseGiftOrderLooseResponse(text) {
  if (text == null || typeof text !== 'string') return null;
  const s = stripBomAndTrim(text);
  if (!s) return null;
  const okTrue = /"ok"\s*:\s*true/.test(s);
  const statusOk = /"status"\s*:\s*"success"/i.test(s);
  const orderM = s.match(/"order_id"\s*:\s*(\d+)/);
  const order_id = orderM ? Number(orderM[1]) : undefined;
  if (!okTrue) return null;
  if (!statusOk && order_id == null) return null;
  return {
    ok: true,
    status: 'success',
    ...(order_id != null && !Number.isNaN(order_id) ? { order_id } : {}),
  };
}
