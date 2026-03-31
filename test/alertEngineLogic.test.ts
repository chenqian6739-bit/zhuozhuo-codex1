import test from "node:test";
import assert from "node:assert/strict";
import { isInCooldown, shouldTriggerThreshold } from "../src/utils/alertRules.js";

test("threshold triggers when finalPrice <= target", () => {
  assert.equal(shouldTriggerThreshold(99, 100), true);
  assert.equal(shouldTriggerThreshold(100, 100), true);
  assert.equal(shouldTriggerThreshold(101, 100), false);
});

test("cooldown returns true if last send is within cooldown window", () => {
  const now = new Date("2026-03-31T12:00:00.000Z");
  const lastSentAt = new Date("2026-03-31T11:30:00.000Z");
  assert.equal(isInCooldown(lastSentAt, 60, now), true);
  assert.equal(isInCooldown(lastSentAt, 15, now), false);
});
