import path from "path";
import { deleteUnusedMetaFiles } from "./utils/clean";
import { runCommand } from "./utils/command";
import tinyPng from "./utils/tiny-png";

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
  /**
   * @en Generate config
   * @zh 生成配置
   */
  async generateConfig() {
    console.log("开始生成配置");
    const scriptDir =
      process.platform === "win32" ? "scripts/windows" : "scripts/unix";
    const script = process.platform === "win32" ? "gen.bat" : "gen.sh";
    const command =
      process.platform === "win32" ? `${scriptDir}/${script}` : "sh";
    const args = process.platform === "win32" ? [] : [`${scriptDir}/${script}`];
    try {
      await runCommand(command, args, { cwd: Editor.Project.path });
      console.log("配置生成完毕");
      Editor.Dialog.info("配置生成完毕", {
        buttons: [Editor.I18n.t("assistant.ok")],
      });
    } catch (e: any) {
      await Editor.Dialog.error("配置生成失败", {
        detail: `${e.message}\n（打开控制台查看详情）`,
        buttons: [Editor.I18n.t("assistant.close")],
      });
    }
  },
  /**
   * @en Compress pictures
   * @zh 压缩图片
   */
  async compressPictures() {
    console.log("开始压缩图片");
    tinyPng(path.join(Editor.Project.path, "assets"));
    Editor.Dialog.info("图片压缩完毕", {
      buttons: [Editor.I18n.t("assistant.ok")],
    });
  },
  publishToWeChat() {
    console.log("发布到微信小游戏");
  },
  publishToByteDance() {
    console.log("发布到字节小游戏");
  },
  /**
   * @en Clean unused meta files
   * @zh 清理未使用的 meta 文件
   */
  cleanUnusedMetaFiles() {
    console.log("开始清理未使用的 meta 文件");
    deleteUnusedMetaFiles(path.join(Editor.Project.path, "assets"));
    deleteUnusedMetaFiles(
      path.join(Editor.Project.path, "extensions/core/assets")
    );
    Editor.Dialog.info("清理完毕", {
      buttons: [Editor.I18n.t("assistant.ok")],
    });
  },
};

/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
export function load() {}

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
export function unload() {}
