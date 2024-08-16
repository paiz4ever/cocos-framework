"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const path_1 = __importDefault(require("path"));
const clean_1 = require("./utils/clean");
const command_1 = require("./utils/command");
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
    publishToWeChat() {
        console.log("构建并上传");
    },
    publishToByteDance() {
        console.log("构建并上传");
    },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF3QjtBQUN4Qix5Q0FBc0Q7QUFDdEQsNkNBQTZDO0FBRTdDOzs7R0FHRztBQUNVLFFBQUEsT0FBTyxHQUE0QztJQUM5RDs7O09BR0c7SUFDSCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sU0FBUyxHQUNiLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3BFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNuRSxNQUFNLE9BQU8sR0FDWCxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqRSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDNUUsSUFBSTtZQUNGLE1BQU0sSUFBQSxvQkFBVSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUMzQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUN6QyxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU8sQ0FBTSxFQUFFO1lBQ2YsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLGVBQWU7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDNUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBQ0QsZUFBZTtRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUNELGtCQUFrQjtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxvQkFBb0I7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLElBQUEsNkJBQXFCLEVBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUEsNkJBQXFCLEVBQ25CLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLENBQUMsQ0FDekQsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN6QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQztBQUVGOzs7R0FHRztBQUNILFNBQWdCLElBQUksS0FBSSxDQUFDO0FBQXpCLG9CQUF5QjtBQUV6Qjs7O0dBR0c7QUFDSCxTQUFnQixNQUFNLEtBQUksQ0FBQztBQUEzQix3QkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVsZXRlVW51c2VkTWV0YUZpbGVzIH0gZnJvbSBcIi4vdXRpbHMvY2xlYW5cIjtcbmltcG9ydCB7IHJ1bkNvbW1hbmQgfSBmcm9tIFwiLi91dGlscy9jb21tYW5kXCI7XG5cbi8qKlxuICogQGVuIFJlZ2lzdHJhdGlvbiBtZXRob2QgZm9yIHRoZSBtYWluIHByb2Nlc3Mgb2YgRXh0ZW5zaW9uXG4gKiBAemgg5Li65omp5bGV55qE5Li76L+b56iL55qE5rOo5YaM5pa55rOVXG4gKi9cbmV4cG9ydCBjb25zdCBtZXRob2RzOiB7IFtrZXk6IHN0cmluZ106ICguLi5hbnk6IGFueSkgPT4gYW55IH0gPSB7XG4gIC8qKlxuICAgKiBAZW4gR2VuZXJhdGUgY29uZmlnXG4gICAqIEB6aCDnlJ/miJDphY3nva5cbiAgICovXG4gIGFzeW5jIGdlbmVyYXRlQ29uZmlnKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5byA5aeL55Sf5oiQ6YWN572uXCIpO1xuICAgIGNvbnN0IHNjcmlwdERpciA9XG4gICAgICBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcInNjcmlwdHMvd2luZG93c1wiIDogXCJzY3JpcHRzL3VuaXhcIjtcbiAgICBjb25zdCBzY3JpcHQgPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcImdlbi5iYXRcIiA6IFwiZ2VuLnNoXCI7XG4gICAgY29uc3QgY29tbWFuZCA9XG4gICAgICBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBgJHtzY3JpcHREaXJ9LyR7c2NyaXB0fWAgOiBcInNoXCI7XG4gICAgY29uc3QgYXJncyA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IFtdIDogW2Ake3NjcmlwdERpcn0vJHtzY3JpcHR9YF07XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHJ1bkNvbW1hbmQoY29tbWFuZCwgYXJncywgeyBjd2Q6IEVkaXRvci5Qcm9qZWN0LnBhdGggfSk7XG4gICAgICBjb25zb2xlLmxvZyhcIumFjee9rueUn+aIkOWujOavlVwiKTtcbiAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcIumFjee9rueUn+aIkOWujOavlVwiLCB7XG4gICAgICAgIGJ1dHRvbnM6IFtFZGl0b3IuSTE4bi50KFwiYXNzaXN0YW50Lm9rXCIpXSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgYXdhaXQgRWRpdG9yLkRpYWxvZy5lcnJvcihcIumFjee9rueUn+aIkOWksei0pVwiLCB7XG4gICAgICAgIGRldGFpbDogYCR7ZS5tZXNzYWdlfVxcbu+8iOaJk+W8gOaOp+WItuWPsOafpeeci+ivpuaDhe+8iWAsXG4gICAgICAgIGJ1dHRvbnM6IFtFZGl0b3IuSTE4bi50KFwiYXNzaXN0YW50LmNsb3NlXCIpXSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgcHVibGlzaFRvV2VDaGF0KCkge1xuICAgIGNvbnNvbGUubG9nKFwi5p6E5bu65bm25LiK5LygXCIpO1xuICB9LFxuICBwdWJsaXNoVG9CeXRlRGFuY2UoKSB7XG4gICAgY29uc29sZS5sb2coXCLmnoTlu7rlubbkuIrkvKBcIik7XG4gIH0sXG4gIGNsZWFuVW51c2VkTWV0YUZpbGVzKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5byA5aeL5riF55CG5pyq5L2/55So55qEIG1ldGEg5paH5Lu2XCIpO1xuICAgIGRlbGV0ZVVudXNlZE1ldGFGaWxlcyhwYXRoLmpvaW4oRWRpdG9yLlByb2plY3QucGF0aCwgXCJhc3NldHNcIikpO1xuICAgIGRlbGV0ZVVudXNlZE1ldGFGaWxlcyhcbiAgICAgIHBhdGguam9pbihFZGl0b3IuUHJvamVjdC5wYXRoLCBcImV4dGVuc2lvbnMvY29yZS9hc3NldHNcIilcbiAgICApO1xuICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcIua4heeQhuWujOavlVwiLCB7XG4gICAgICBidXR0b25zOiBbRWRpdG9yLkkxOG4udChcImFzc2lzdGFudC5va1wiKV0sXG4gICAgfSk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEBlbiBNZXRob2QgVHJpZ2dlcmVkIG9uIEV4dGVuc2lvbiBTdGFydHVwXG4gKiBAemgg5omp5bGV5ZCv5Yqo5pe26Kem5Y+R55qE5pa55rOVXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKCkge31cblxuLyoqXG4gKiBAZW4gTWV0aG9kIHRyaWdnZXJlZCB3aGVuIHVuaW5zdGFsbGluZyB0aGUgZXh0ZW5zaW9uXG4gKiBAemgg5Y246L295omp5bGV5pe26Kem5Y+R55qE5pa55rOVXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWQoKSB7fVxuIl19