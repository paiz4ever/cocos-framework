import { _decorator, Component, Node, Sprite } from "cc";
import { EventMgr, LanguageMgr, ResMgr } from "../../../internal/managers";
const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass("LanguageSprite")
@menu("language/LanguageSprite")
@requireComponent(Sprite)
export class LanguageSprite extends Component {
  @property({ tooltip: "图片路径（不同语言路径请保持一致！）" })
  path: string = "";

  private isFirstEnable = true;
  private declare spriteComponent: Sprite;

  protected onLoad(): void {
    this.spriteComponent = this.getComponent(Sprite);
  }

  protected onEnable(): void {
    EventMgr.on("languageChanged", this.refresh, this);
    this.refresh(LanguageMgr.current);
    if (this.isFirstEnable) {
      this.isFirstEnable = false;
      return;
    }
    // 手动增加引用计数（这里是为了复原onDisable中减去的引用计数）
    this.spriteComponent.spriteFrame &&
      this.spriteComponent.spriteFrame.addRef();
  }

  protected onDisable(): void {
    EventMgr.offTarget(this);
    // 手动减少引用计数，但不自动释放，后续节点显示时资源复用
    this.spriteComponent.spriteFrame &&
      this.spriteComponent.spriteFrame.decRef(false);
  }

  private refresh(lang: TLanguage) {
    ResMgr.loadSpriteFrame({
      path: `${lang}/${this.path}`,
      bundleName: "internal-language",
    }).then((spriteFrame) => {
      const old = this.spriteComponent.spriteFrame;
      if (old === spriteFrame) return;
      this.spriteComponent.spriteFrame = spriteFrame;
      spriteFrame.addRef();
      old && old.decRef();
    });
  }
}
