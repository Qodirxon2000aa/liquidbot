/** PHP oldidan chiqindi bo‘lsa — birinchi `{` dan JSON */
export function parseJsonMaybeLeadingNoise(text) {
  if (text == null || typeof text !== 'string') return null;
  const i = text.indexOf('{');
  if (i < 0) return null;
  try {
    return JSON.parse(text.slice(i));
  } catch {
    return null;
  }
}
