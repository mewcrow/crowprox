export class OnRequestStrategy {
  constructor() {
    console.error("OnRequestStrategy not implemented");
  }

  handleRequest(details: { tabId: number; url: string }) {
    const proxy = { type: "http", host: "127.0.0.1", port: 10809 };

    return { type: "direct" };
  }
}
