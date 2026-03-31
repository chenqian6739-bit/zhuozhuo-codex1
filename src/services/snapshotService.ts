import { prisma } from "../persistence/prisma.js";
import { resolveAdapter } from "../adapters/platform/registry.js";
import { evaluateAlerts } from "./alertEngine.js";

export async function checkProduct(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.monitoringEnabled) {
    return null;
  }

  const adapter = resolveAdapter(product.url);

  for (let attempt = 0; attempt <= 2; attempt += 1) {
    try {
      const parsed = await adapter.parsePrice(product.url);
      const snapshot = await prisma.priceSnapshot.create({
        data: {
          productId: product.id,
          platform: product.platform,
          skuId: parsed.skuId,
          listedPrice: parsed.listedPrice,
          finalPrice: parsed.finalPrice,
          currency: parsed.currency,
          discountText: parsed.discountText,
          inStock: parsed.inStock,
          rawPayload: parsed.rawPayload,
        },
      });

      await prisma.crawlRunLog.create({
        data: {
          productId: product.id,
          platform: product.platform,
          status: "SUCCESS",
          retryCount: attempt,
        },
      });

      await evaluateAlerts(product.id, parsed.finalPrice ?? parsed.listedPrice);
      return snapshot;
    } catch (error) {
      const isLastAttempt = attempt === 2;
      await prisma.crawlRunLog.create({
        data: {
          productId: product.id,
          platform: product.platform,
          status: "PARSE_FAILED",
          retryCount: attempt,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        },
      });
      if (isLastAttempt) {
        throw error;
      }
    }
  }

  return null;
}
