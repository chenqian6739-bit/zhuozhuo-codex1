import test from "node:test";
import assert from "node:assert/strict";
import { parseChinesePrice } from "../src/utils/priceParser.js";

test("parseChinesePrice parses ¥ prefix", () => {
  assert.equal(parseChinesePrice("¥199.50"), 199.5);
});

test("parseChinesePrice returns undefined for non-number", () => {
  assert.equal(parseChinesePrice("sold out"), undefined);
});
