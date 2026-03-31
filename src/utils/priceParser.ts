export function parseChinesePrice(input: string): number | undefined {
  const match = input.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return undefined;
  }
  return Number.parseFloat(match[1]);
}
