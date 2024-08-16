import { runCommand } from "./utils";

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
  /**
   * @en A method that can be triggered by message
   * @zh 通过 message 触发的方法
   */
  cleanUnusedMetaFile() {
    console.log("清理多余的 meta 文件");
  },
  buildAndUpload() {
    console.log("构建并上传");
  },
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
