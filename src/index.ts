import express from "express";
import { env } from "./config/env.js";
import { productRouter } from "./api/routes/products.js";
import { ruleRouter } from "./api/routes/rules.js";
import { logRouter } from "./api/routes/logs.js";
import { startScheduler } from "./scheduler/priceScheduler.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "price-watcher", timezone: env.DEFAULT_TIMEZONE });
});

app.use("/api/products", productRouter);
app.use("/api", ruleRouter);
app.use("/api", logRouter);

app.listen(env.PORT, () => {
  startScheduler();
  console.log(`Price Watcher running on :${env.PORT}`);
});
