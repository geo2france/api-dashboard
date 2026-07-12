/**
 * Merge profond de deux objets (compatible ThemeConfig).
 * Les tableaux du `target` écrasent ceux du `source` (comportement Ant Design).
 */
export function deepMerge<T extends Record<string, unknown>>(source: T, target: Partial<T>): T {
  const result = { ...source };

  for (const key in target) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (
      targetVal !== null &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal) &&
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal)
    ) {
      result[key] = deepMerge(
        sourceVal as Record<string, unknown>,
        targetVal as Record<string, unknown>,
      ) as T[typeof key];
    } else if (targetVal !== undefined) {
      result[key] = targetVal as T[typeof key];
    }
  }

  return result;
}
