export function shouldTriggerThreshold(finalPrice: number | undefined, thresholdValue: number): boolean {
  if (finalPrice === undefined) {
    return false;
  }
  return finalPrice <= thresholdValue;
}

export function isInCooldown(lastSentAt: Date | null, cooldownMinutes: number, now: Date): boolean {
  if (!lastSentAt) {
    return false;
  }
  const elapsed = now.getTime() - lastSentAt.getTime();
  return elapsed < cooldownMinutes * 60_000;
}
