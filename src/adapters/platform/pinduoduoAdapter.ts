import type { PlatformAdapter, ParsedPriceSnapshot, ParsedProductMetadata } from "../../domain/types.js";

export class PinduoduoAdapter implements PlatformAdapter {
  platform = "PINDUODUO" as const;

  canHandle(url: string): boolean {
    return /pinduoduo\.com|yangkeduo\.com/.test(url);
  }

  async parseMetadata(url: string): Promise<ParsedProductMetadata> {
    const match = url.match(/goods_id=(\d+)/);
    return {
      externalProductId: match?.[1] ?? "unknown",
      title: "Pinduoduo Product (placeholder)",
      imageUrl: undefined,
      defaultSkuId: undefined,
    };
  }

  async parsePrice(url: string): Promise<ParsedPriceSnapshot> {
    return {
      currency: "CNY",
      listedPrice: 89,
      finalPrice: 75,
      discountText: "MVP placeholder parser",
      inStock: true,
      rawPayload: { sourceUrl: url, adapter: this.platform },
    };
  }
}
