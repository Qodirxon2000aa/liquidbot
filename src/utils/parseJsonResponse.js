/** PHP oldi/oxirida chiqindi bo‘lsa ham birinchi JSON objectni ajratib oladi */
export function parseJsonMaybeLeadingNoise(text) {
  if (text == null || typeof text !== 'string') return null;
  const start = text.indexOf('{');
  if (start < 0) return null;

  // Fast path: first "{" dan boshlab to'liq JSON bo'lsa.
  try {
    return JSON.parse(text.slice(start));
  } catch {
    /* continue */
  }

  // Slow path: birinchi tugallangan {} blokni topib parse qilish.
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
