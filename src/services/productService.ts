import { prisma } from "../persistence/prisma.js";
import { resolveAdapter } from "../adapters/platform/registry.js";

export async function createProduct(input: { url: string; targetPrice: number }) {
  const adapter = resolveAdapter(input.url);
  const metadata = await adapter.parseMetadata(input.url);

  const product = await prisma.product.create({
    data: {
      platform: adapter.platform,
      url: input.url,
      externalProductId: metadata.externalProductId,
      title: metadata.title,
      imageUrl: metadata.imageUrl,
      defaultSkuId: metadata.defaultSkuId,
      rules: {
        create: {
          thresholdValue: input.targetPrice,
          cooldownMinutes: 720,
        },
      },
    },
    include: { rules: true },
  });

  return product;
}
