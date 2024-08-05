import { _decorator, CCString, Component, Label, Node, RichText } from "cc";
import { ConfigMgr, EventMgr, LanguageMgr } from "../../../internal/managers";
const { ccclass, property, menu } = _decorator;

@ccclass("ValueReflect")
class ValueReflect {
  @property({ tooltip: "替换键名" })
  key: string = "";
  @property({ tooltip: "替换值" })
  value: string = "";
}

@ccclass("LanguageLabel")
@menu("language/LanguageLabel")
export class LanguageLabel extends Component {
  static handleReflect(template: string, reflects: any) {
    // 先处理转义的大括号
    template = template.replace(/\\{/g, "\uFFF0").replace(/\\}/g, "\uFFF1");
    // 替换占位符
    template = template.replace(/{{(\w+)}}/g, (_, key) => reflects[key] || "");
    // 恢复转义的大括号
    template = template.replace(/\uFFF0/g, "{").replace(/\uFFF1/g, "}");
    return template;
  }

  @property({ tooltip: "多语言配置ID" })
  id: string = "";
  @property
  _reflects: ValueReflect[] = [];
  @property({ type: [ValueReflect], tooltip: "占位映射表" })
  get reflects() {
    return this._reflects;
  }
  set reflects(reflects: ValueReflect[]) {
    this._reflects = reflects;
  }

  private declare textComponent: Label | RichText;
  private declare reflectMap: { [key: string]: string };

  protected onLoad(): void {
    this.reflectMap = this.reflects.reduce((map, item) => {
      map[item.key] = item.value;
      return map;
    }, {});
    this.textComponent =
      this.getComponent(Label) || this.getComponent(RichText);
  }

  protected onEnable(): void {
    EventMgr.on("languageChanged", this.refresh, this);
    this.refresh(LanguageMgr.current);
  }

  protected onDisable(): void {
    EventMgr.offTarget(this);
  }

  private refresh(lang: TLanguage) {
    const langItem = ConfigMgr.tables.TbLanguage.get(this.id);
    if (!langItem || !langItem[lang]) {
      this.textComponent.string = this.id;
      return;
    }
    const value = langItem[lang];
    this.textComponent.string = LanguageLabel.handleReflect(
      value,
      this.reflectMap
    );
  }
}
