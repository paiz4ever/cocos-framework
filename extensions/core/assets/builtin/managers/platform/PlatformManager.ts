import { isByteDance, isKuaishou, isWeChat } from "../../../utils/platform";
import Singleton from "../../structs/abstract/Singleton";
import BasicAdapter from "./adapters/Basic";
import ByteDanceAdapter from "./adapters/ByteDance";
import KuaiShouAdapter from "./adapters/KuaiShou";
import WeChatAdapter from "./adapters/WeChat";

class PlatformManager extends Singleton {
  private _pt: IPlatform;
  get pt(): IPlatform {
    if (!this._pt) {
      if (isByteDance()) {
        this._pt = ByteDanceAdapter.getInstance();
      } else if (isWeChat()) {
        this._pt = WeChatAdapter.getInstance();
      } else if (isKuaishou()) {
        this._pt = KuaiShouAdapter.getInstance();
      } else {
        this._pt = BasicAdapter.getInstance();
      }
    }
    return this._pt;
  }

  init(options: IInjectOptions) {
    // @ts-ignore
    this.pt.inject(options);
  }
}

const PlatformMgr = PlatformManager.getInstance().pt;
export default PlatformMgr;
