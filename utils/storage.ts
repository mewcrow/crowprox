import { storage } from "wxt/utils/storage";

export const hostsStorage = storage.defineItem<string[]>("local:hosts", {
  defaultValue: [],
});
