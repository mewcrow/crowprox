import { storage } from 'wxt/utils/storage';

export interface Host {
  id: string;
  name: string;
  url: string;
}

export const hostsStorage = storage.defineItem<Host[]>('local:hosts', {
  defaultValue: [],
});
