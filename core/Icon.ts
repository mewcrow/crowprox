export class Icon {
  private baseIcon?: ImageBitmap;
  public iconData: Record<string, ImageData> = {};
  public grayscaleIconData: Record<string, ImageData> = {};

  public async init() {
    this.baseIcon = await this.loadBaseIcon();
    this.iconData = await this.generate();
    this.grayscaleIconData = await this.generate({ grayscale: true });
  }

  get colored() {
    return this.iconData;
  }

  get grayscale() {
    return this.grayscaleIconData;
  }

  public async generate(opts = { grayscale: false }) {
    const sizes = [16, 32];
    const iconData: Record<string, ImageData> = {};

    for (const size of sizes) {
      const canvas = new OffscreenCanvas(size, size);
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      ctx.clearRect(0, 0, size, size);

      if (opts.grayscale) {
        ctx.filter = "grayscale(100%) opacity(0.5)";
      }

      if (this.baseIcon) {
        ctx.drawImage(this.baseIcon, 0, 0, size, size);
      }
      iconData[size.toString()] = ctx.getImageData(0, 0, size, size);
    }

    return iconData;
  }

  private async loadBaseIcon() {
    const iconPath = browser.runtime.getURL("/icons/32.png" as any);
    const response = await fetch(iconPath);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  }
}

export const icon = new Icon();
