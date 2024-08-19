"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const path_1 = __importDefault(require("path"));
const clean_1 = require("./utils/clean");
const command_1 = require("./utils/command");
const tiny_png_1 = __importDefault(require("./utils/tiny-png"));
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    /**
     * @en Generate config
     * @zh 生成配置
     */
    async generateConfig() {
        console.log("开始生成配置");
        const scriptDir = process.platform === "win32" ? "scripts/windows" : "scripts/unix";
        const script = process.platform === "win32" ? "gen.bat" : "gen.sh";
        const command = process.platform === "win32" ? `${scriptDir}/${script}` : "sh";
        const args = process.platform === "win32" ? [] : [`${scriptDir}/${script}`];
        try {
            await (0, command_1.runCommand)(command, args, { cwd: Editor.Project.path });
            console.log("配置生成完毕");
            Editor.Dialog.info("配置生成完毕", {
                buttons: [Editor.I18n.t("assistant.ok")],
            });
        }
        catch (e) {
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
        await (0, tiny_png_1.default)(path_1.default.join(Editor.Project.path, "assets"));
        Editor.Dialog.info("图片压缩完毕", {
            buttons: [Editor.I18n.t("assistant.ok")],
        });
    },
    async publishToWeChat() {
        console.log("发布到微信小游戏");
    },
    async publishToByteDance() {
        console.log("发布到字节小游戏");
    },
    /**
     * @en Clean unused meta files
     * @zh 清理未使用的 meta 文件
     */
    cleanUnusedMetaFiles() {
        console.log("开始清理未使用的 meta 文件");
        (0, clean_1.deleteUnusedMetaFiles)(path_1.default.join(Editor.Project.path, "assets"));
        (0, clean_1.deleteUnusedMetaFiles)(path_1.default.join(Editor.Project.path, "extensions/core/assets"));
        Editor.Dialog.info("清理完毕", {
            buttons: [Editor.I18n.t("assistant.ok")],
        });
    },
};
/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
function load() { }
exports.load = load;
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF3QjtBQUN4Qix5Q0FBc0Q7QUFDdEQsNkNBQTZDO0FBQzdDLGdFQUF1QztBQUV2Qzs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDOUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixNQUFNLFNBQVMsR0FDYixPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUNwRSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDbkUsTUFBTSxPQUFPLEdBQ1gsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDakUsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLElBQUk7WUFDRixNQUFNLElBQUEsb0JBQVUsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDM0IsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDekMsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxPQUFPLENBQU0sRUFBRTtZQUNmLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxlQUFlO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzVDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixNQUFNLElBQUEsa0JBQU8sRUFBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzNCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ3pDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZTtRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUMsa0JBQWtCO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILG9CQUFvQjtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEMsSUFBQSw2QkFBcUIsRUFBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBQSw2QkFBcUIsRUFDbkIsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSx3QkFBd0IsQ0FBQyxDQUN6RCxDQUFDO1FBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ3pDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBZ0IsSUFBSSxLQUFJLENBQUM7QUFBekIsb0JBQXlCO0FBRXpCOzs7R0FHRztBQUNILFNBQWdCLE1BQU0sS0FBSSxDQUFDO0FBQTNCLHdCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWxldGVVbnVzZWRNZXRhRmlsZXMgfSBmcm9tIFwiLi91dGlscy9jbGVhblwiO1xuaW1wb3J0IHsgcnVuQ29tbWFuZCB9IGZyb20gXCIuL3V0aWxzL2NvbW1hbmRcIjtcbmltcG9ydCB0aW55UG5nIGZyb20gXCIuL3V0aWxzL3RpbnktcG5nXCI7XG5cbi8qKlxuICogQGVuIFJlZ2lzdHJhdGlvbiBtZXRob2QgZm9yIHRoZSBtYWluIHByb2Nlc3Mgb2YgRXh0ZW5zaW9uXG4gKiBAemgg5Li65omp5bGV55qE5Li76L+b56iL55qE5rOo5YaM5pa55rOVXG4gKi9cbmV4cG9ydCBjb25zdCBtZXRob2RzOiB7IFtrZXk6IHN0cmluZ106ICguLi5hbnk6IGFueSkgPT4gYW55IH0gPSB7XG4gIC8qKlxuICAgKiBAZW4gR2VuZXJhdGUgY29uZmlnXG4gICAqIEB6aCDnlJ/miJDphY3nva5cbiAgICovXG4gIGFzeW5jIGdlbmVyYXRlQ29uZmlnKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5byA5aeL55Sf5oiQ6YWN572uXCIpO1xuICAgIGNvbnN0IHNjcmlwdERpciA9XG4gICAgICBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcInNjcmlwdHMvd2luZG93c1wiIDogXCJzY3JpcHRzL3VuaXhcIjtcbiAgICBjb25zdCBzY3JpcHQgPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcImdlbi5iYXRcIiA6IFwiZ2VuLnNoXCI7XG4gICAgY29uc3QgY29tbWFuZCA9XG4gICAgICBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBgJHtzY3JpcHREaXJ9LyR7c2NyaXB0fWAgOiBcInNoXCI7XG4gICAgY29uc3QgYXJncyA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IFtdIDogW2Ake3NjcmlwdERpcn0vJHtzY3JpcHR9YF07XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHJ1bkNvbW1hbmQoY29tbWFuZCwgYXJncywgeyBjd2Q6IEVkaXRvci5Qcm9qZWN0LnBhdGggfSk7XG4gICAgICBjb25zb2xlLmxvZyhcIumFjee9rueUn+aIkOWujOavlVwiKTtcbiAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcIumFjee9rueUn+aIkOWujOavlVwiLCB7XG4gICAgICAgIGJ1dHRvbnM6IFtFZGl0b3IuSTE4bi50KFwiYXNzaXN0YW50Lm9rXCIpXSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgYXdhaXQgRWRpdG9yLkRpYWxvZy5lcnJvcihcIumFjee9rueUn+aIkOWksei0pVwiLCB7XG4gICAgICAgIGRldGFpbDogYCR7ZS5tZXNzYWdlfVxcbu+8iOaJk+W8gOaOp+WItuWPsOafpeeci+ivpuaDhe+8iWAsXG4gICAgICAgIGJ1dHRvbnM6IFtFZGl0b3IuSTE4bi50KFwiYXNzaXN0YW50LmNsb3NlXCIpXSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQGVuIENvbXByZXNzIHBpY3R1cmVzXG4gICAqIEB6aCDljovnvKnlm77niYdcbiAgICovXG4gIGFzeW5jIGNvbXByZXNzUGljdHVyZXMoKSB7XG4gICAgY29uc29sZS5sb2coXCLlvIDlp4vljovnvKnlm77niYdcIik7XG4gICAgYXdhaXQgdGlueVBuZyhwYXRoLmpvaW4oRWRpdG9yLlByb2plY3QucGF0aCwgXCJhc3NldHNcIikpO1xuICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcIuWbvueJh+WOi+e8qeWujOavlVwiLCB7XG4gICAgICBidXR0b25zOiBbRWRpdG9yLkkxOG4udChcImFzc2lzdGFudC5va1wiKV0sXG4gICAgfSk7XG4gIH0sXG5cbiAgYXN5bmMgcHVibGlzaFRvV2VDaGF0KCkge1xuICAgIGNvbnNvbGUubG9nKFwi5Y+R5biD5Yiw5b6u5L+h5bCP5ri45oiPXCIpO1xuICB9LFxuXG4gIGFzeW5jIHB1Ymxpc2hUb0J5dGVEYW5jZSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIuWPkeW4g+WIsOWtl+iKguWwj+a4uOaIj1wiKTtcbiAgfSxcblxuICAvKipcbiAgICogQGVuIENsZWFuIHVudXNlZCBtZXRhIGZpbGVzXG4gICAqIEB6aCDmuIXnkIbmnKrkvb/nlKjnmoQgbWV0YSDmlofku7ZcbiAgICovXG4gIGNsZWFuVW51c2VkTWV0YUZpbGVzKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5byA5aeL5riF55CG5pyq5L2/55So55qEIG1ldGEg5paH5Lu2XCIpO1xuICAgIGRlbGV0ZVVudXNlZE1ldGFGaWxlcyhwYXRoLmpvaW4oRWRpdG9yLlByb2plY3QucGF0aCwgXCJhc3NldHNcIikpO1xuICAgIGRlbGV0ZVVudXNlZE1ldGFGaWxlcyhcbiAgICAgIHBhdGguam9pbihFZGl0b3IuUHJvamVjdC5wYXRoLCBcImV4dGVuc2lvbnMvY29yZS9hc3NldHNcIilcbiAgICApO1xuICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcIua4heeQhuWujOavlVwiLCB7XG4gICAgICBidXR0b25zOiBbRWRpdG9yLkkxOG4udChcImFzc2lzdGFudC5va1wiKV0sXG4gICAgfSk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEBlbiBNZXRob2QgVHJpZ2dlcmVkIG9uIEV4dGVuc2lvbiBTdGFydHVwXG4gKiBAemgg5omp5bGV5ZCv5Yqo5pe26Kem5Y+R55qE5pa55rOVXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKCkge31cblxuLyoqXG4gKiBAZW4gTWV0aG9kIHRyaWdnZXJlZCB3aGVuIHVuaW5zdGFsbGluZyB0aGUgZXh0ZW5zaW9uXG4gKiBAemgg5Y246L295omp5bGV5pe26Kem5Y+R55qE5pa55rOVXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWQoKSB7fVxuIl19