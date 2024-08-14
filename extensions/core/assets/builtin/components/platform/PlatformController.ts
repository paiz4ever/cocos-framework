/**
 * 平台可见性控制器
 */
import { _decorator, Component, Enum, Node } from "cc";
import { EPlatform, getPlatformName } from "../../utils/platform";
const { ccclass, property, menu } = _decorator;

@ccclass("PlatformController")
@menu("platform/PlatformController")
export class PlatformController extends Component {
  @property({ type: [Enum(EPlatform)], tooltip: "可见的平台" })
  visibleOnPlatforms: EPlatform[] = [];
  @property({ type: [Enum(EPlatform)], tooltip: "隐藏的平台" })
  hiddenOnPlatforms: EPlatform[] = [];

  protected onLoad(): void {
    if (!this.visibleOnPlatforms.length && !this.hiddenOnPlatforms.length) {
      return;
    }
    let pt = getPlatformName();
    if (this.visibleOnPlatforms.includes(pt)) {
      this.node.active = true;
    } else if (this.hiddenOnPlatforms.includes(pt)) {
      this.node.active = false;
    } else {
      this.node.active = false;
    }
  }
}
