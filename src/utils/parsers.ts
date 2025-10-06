/** Parser automatiquement un nombre au format : 0.6, "0.6" ou "0,6" */
export const parseNumber = (value:string | number) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.replace(",", ".");
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      return num;
    }
  }
  return NaN;
}