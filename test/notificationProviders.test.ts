import test from "node:test";
import assert from "node:assert/strict";
import { EmailProvider, TelegramProvider } from "../src/notifications/providers.js";

const message = {
  title: "demo",
  currentPrice: 88,
  targetPrice: 99,
  platform: "TAOBAO",
  url: "https://item.taobao.com/item.htm?id=1",
  timestamp: new Date(),
};

test("telegram provider mock send", async () => {
  const provider = new TelegramProvider();
  const result = await provider.send(message);
  assert.equal(result.status, "sent");
});

test("email provider mock send", async () => {
  const provider = new EmailProvider();
  const result = await provider.send(message);
  assert.equal(result.status, "sent");
});
