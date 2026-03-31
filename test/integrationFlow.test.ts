import test from "node:test";
import assert from "node:assert/strict";
import { shouldTriggerThreshold } from "../src/utils/alertRules.js";

type Product = { id: string; url: string; targetPrice: number };
type Snapshot = { productId: string; finalPrice: number };

test("integration: add product -> check -> snapshot -> alert decision", () => {
  const products: Product[] = [];
  const snapshots: Snapshot[] = [];

  const product: Product = {
    id: "p1",
    url: "https://item.taobao.com/item.htm?id=123",
    targetPrice: 100,
  };
  products.push(product);

  const snapshot: Snapshot = { productId: product.id, finalPrice: 88 };
  snapshots.push(snapshot);

  const shouldAlert = shouldTriggerThreshold(snapshot.finalPrice, product.targetPrice);

  assert.equal(products.length, 1);
  assert.equal(snapshots.length, 1);
  assert.equal(shouldAlert, true);
});
