import { sys } from "cc";
import { MINIGAME } from "cc/env";

/** 是否是微信小游戏 */
export function isWeChat() {
  return (
    sys.platform === sys.Platform.WECHAT_GAME &&
    typeof KSGameGlobal === "undefined"
  );
}

/** 是否是字节跳动小游戏 */
export function isByteDance() {
  return sys.platform === sys.Platform.BYTEDANCE_MINI_GAME;
}

declare const KSGameGlobal: any;
/** 是否是快手小游戏 */
export function isKuaishou() {
  return typeof KSGameGlobal !== "undefined";
}

/** 获取当前小游戏全局变量 */
export function getMiniGameGlobalVariable() {
  if (!MINIGAME) return undefined;
  return isWeChat() ? wx : isByteDance() ? tt : isKuaishou() ? ks : undefined;
}

/** 平台类型 */
export enum EPlatform {
  WeChat = "WeChat",
  ByteDance = "ByteDance",
  KuaiShou = "KuaiShou",
}

/** 获取平台名 */
export function getPlatformName() {
  return isWeChat()
    ? EPlatform.WeChat
    : isByteDance()
    ? EPlatform.ByteDance
    : isKuaishou()
    ? EPlatform.KuaiShou
    : undefined;
}
