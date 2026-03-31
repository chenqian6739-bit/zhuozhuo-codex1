import type { PlatformAdapter, ParsedPriceSnapshot, ParsedProductMetadata } from "../../domain/types.js";

export class TaobaoAdapter implements PlatformAdapter {
  platform = "TAOBAO" as const;

  canHandle(url: string): boolean {
    return /taobao\.com|tmall\.com/.test(url);
  }

  async parseMetadata(url: string): Promise<ParsedProductMetadata> {
    const match = url.match(/id=(\d+)/);
    return {
      externalProductId: match?.[1] ?? "unknown",
      title: "Taobao Product (placeholder)",
      imageUrl: undefined,
      defaultSkuId: undefined,
    };
  }

  async parsePrice(url: string): Promise<ParsedPriceSnapshot> {
    return {
      currency: "CNY",
      listedPrice: 199,
      finalPrice: 179,
      discountText: "MVP placeholder parser",
      inStock: true,
      rawPayload: { sourceUrl: url, adapter: this.platform },
    };
  }
}
