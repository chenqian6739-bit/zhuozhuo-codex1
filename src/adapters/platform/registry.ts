import type { PlatformAdapter } from "../../domain/types.js";
import { PinduoduoAdapter } from "./pinduoduoAdapter.js";
import { TaobaoAdapter } from "./taobaoAdapter.js";

const adapters: PlatformAdapter[] = [new TaobaoAdapter(), new PinduoduoAdapter()];

export function resolveAdapter(url: string): PlatformAdapter {
  const adapter = adapters.find((candidate) => candidate.canHandle(url));
  if (!adapter) {
    throw new Error("Unsupported platform URL");
  }
  return adapter;
}
