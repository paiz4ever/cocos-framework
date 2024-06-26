/**
 * 平台管理器
 */
import { isByteDance, isKuaishou, isWeChat } from "../../utils/platform";
import Singleton from "../../structs/abstract/Singleton";
import BasicAdapter from "./adapters/BasicAdapter";
import ByteDanceAdapter from "./adapters/ByteDanceAdapter";
import KuaiShouAdapter from "./adapters/KuaiShouAdapter";
import WeChatAdapter from "./adapters/WeChatAdapter";

class PlatformManager extends Singleton {
  private _pt: IPlatform;
  get pt(): IPlatform {
    if (!this._pt) {
      if (isByteDance()) {
        this._pt = ByteDanceAdapter.getInstance();
      } else if (isKuaishou()) {
        this._pt = KuaiShouAdapter.getInstance();
      } else if (isWeChat()) {
        this._pt = WeChatAdapter.getInstance();
      } else {
        this._pt = BasicAdapter.getInstance();
      }
    }
    return this._pt;
  }
}

const PlatformMgr = PlatformManager.getInstance().pt;
export default PlatformMgr;
