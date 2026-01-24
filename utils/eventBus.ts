import mitt from "mitt";

export type Events = {
  "icon:clicked": number;
  "proxy:hosts-updated": string[];
};

export const eventBus = mitt<Events>();
export const emit = eventBus.emit;
export const on = eventBus.on;
