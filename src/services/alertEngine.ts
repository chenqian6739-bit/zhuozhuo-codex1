import crypto from "node:crypto";
import dayjs from "dayjs";
import { prisma } from "../persistence/prisma.js";
import { notificationProviders } from "../notifications/providers.js";

export async function evaluateAlerts(productId: string, finalPrice?: number) {
  if (finalPrice === undefined) {
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { rules: true },
  });

  if (!product) {
    return;
  }

  for (const rule of product.rules.filter((item) => item.isEnabled)) {
    if (finalPrice > rule.thresholdValue) {
      continue;
    }

    const latestLog = await prisma.notificationLog.findFirst({
      where: { productId: product.id, ruleId: rule.id },
      orderBy: { sentAt: "desc" },
    });

    const inCooldown = latestLog
      ? dayjs().diff(dayjs(latestLog.sentAt), "minute") < rule.cooldownMinutes
      : false;

    if (inCooldown) {
      continue;
    }

    const provider = notificationProviders.find((candidate) => candidate.channel === product.preferredChannel);
    if (!provider) {
      continue;
    }

    const sendResult = await provider.send({
      title: product.title,
      currentPrice: finalPrice,
      targetPrice: rule.thresholdValue,
      platform: product.platform,
      url: product.url,
      timestamp: new Date(),
    });

    await prisma.notificationLog.create({
      data: {
        productId: product.id,
        ruleId: rule.id,
        channel: provider.channel,
        status: sendResult.status,
        messageHash: crypto
          .createHash("sha256")
          .update(`${product.id}-${rule.id}-${finalPrice}`)
          .digest("hex"),
      },
    });
  }
}
