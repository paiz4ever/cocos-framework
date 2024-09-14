/**
 * RenderTexture.prototype.readPixels会出现安卓崩溃问题
 * 路径：cocos/asset/assets/render-texture.ts
 * 大概率是 `const gfxDevice = this._getGFXDevice();` 这里的问题
 */
import { director, gfx, Texture2D } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
  Texture2D.prototype.readPixels = function (
    x = 0,
    y = 0,
    width?: number,
    height?: number,
    buffer?: Uint8Array
  ) {
    const self = this as Texture2D;
    width = width || self.width;
    height = height || self.height;
    const gfxTexture = self.getGFXTexture();
    if (!gfxTexture) {
      return null;
    }
    const needSize = 4 * width * height;
    if (buffer === undefined) {
      buffer = new Uint8Array(needSize);
    } else if (buffer.length < needSize) {
      return null;
    }
    const bufferViews: ArrayBufferView[] = [];
    const regions: gfx.BufferTextureCopy[] = [];
    const region0 = new gfx.BufferTextureCopy();
    region0.texOffset.x = x;
    region0.texOffset.y = y;
    region0.texExtent.width = width;
    region0.texExtent.height = height;
    regions.push(region0);
    bufferViews.push(buffer);
    director.root?.device.copyTextureToBuffers(
      gfxTexture,
      bufferViews,
      regions
    );
    return buffer;
  };
}
