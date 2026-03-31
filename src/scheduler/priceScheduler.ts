import cron from "node-cron";
import { env } from "../config/env.js";
import { prisma } from "../persistence/prisma.js";
import { checkProduct } from "../services/snapshotService.js";

export function startScheduler() {
  cron.schedule(env.SCHEDULER_CRON, async () => {
    const products = await prisma.product.findMany({ where: { monitoringEnabled: true } });
    for (const product of products) {
      await checkProduct(product.id);
    }
  });
}
