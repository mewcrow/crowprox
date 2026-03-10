import mitt from "mitt";
import type { TConfig } from "@/core/ConfigStorage";

export type Events = {
  "icon:clicked": number;
  "proxy:config-updated": TConfig;
};

export const eventBus = mitt<Events>();
export const emit = eventBus.emit;
export const on = eventBus.on;
