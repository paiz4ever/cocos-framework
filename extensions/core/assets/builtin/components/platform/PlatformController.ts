import { _decorator, CCBoolean, Component, Enum, Node } from "cc";
import { EPlatform, getPlatformName } from "../../utils/platform";
const { ccclass, property, menu } = _decorator;

/**
 * 平台可见性控制器
 */
@ccclass("PlatformController")
@menu("platform/PlatformController")
export class PlatformController extends Component {
  @property({ tooltip: "平台可见性" })
  visible: boolean = true;
  @property({ type: [Enum(EPlatform)], tooltip: "平台" })
  platforms: EPlatform[] = [];

  protected onLoad(): void {
    let pt = getPlatformName();
    this.node.active = this.visible === this.platforms.includes(pt);
  }
}
