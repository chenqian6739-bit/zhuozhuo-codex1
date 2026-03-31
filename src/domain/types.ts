import type { Platform } from "@prisma/client";

export type ParsedProductMetadata = {
  externalProductId: string;
  title: string;
  imageUrl?: string;
  defaultSkuId?: string;
};

export type ParsedPriceSnapshot = {
  title?: string;
  currency: string;
  listedPrice?: number;
  finalPrice?: number;
  discountText?: string;
  inStock?: boolean;
  skuId?: string;
  rawPayload: Record<string, unknown>;
};

export interface PlatformAdapter {
  platform: Platform;
  canHandle(url: string): boolean;
  parseMetadata(url: string): Promise<ParsedProductMetadata>;
  parsePrice(url: string): Promise<ParsedPriceSnapshot>;
}
