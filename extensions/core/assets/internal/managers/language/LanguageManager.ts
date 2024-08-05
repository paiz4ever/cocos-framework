import { Singleton } from "../../../builtin/structs";
import EventMgr from "../event/EventManager";
import ResMgr from "../res/ResManager";

class LanguageManager extends Singleton {
  static supportedLanguages: TLanguage[] = ["zh", "en"];

  private declare _current: TLanguage;
  private dirty = false;

  get current() {
    return this._current || "zh";
  }

  async set(lang: TLanguage) {
    if (this.dirty) return;
    if (!this.isSupport(lang)) {
      throw new Error(`language ${lang} is not supported`);
    }
    if (this.current === lang) {
      return;
    }
    this.dirty = true;
    try {
      await ResMgr.loadDir({
        path: lang,
        bundleName: "internal-language",
      });
      this._current = lang;
      EventMgr.emit("languageChanged", lang);
    } finally {
      this.dirty = false;
    }
  }

  isSupport(langs: TLanguage | TLanguage[]) {
    if (!Array.isArray(langs)) {
      langs = [langs];
    }
    return langs.every((lang) =>
      LanguageManager.supportedLanguages.includes(lang)
    );
  }
}

const LanguageMgr = new LanguageManager();
export default LanguageMgr;
