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
        (0, tiny_png_1.default)(path_1.default.join(Editor.Project.path, "test"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF3QjtBQUN4Qix5Q0FBc0Q7QUFDdEQsNkNBQTZDO0FBQzdDLGdFQUF1QztBQUV2Qzs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDOUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixNQUFNLFNBQVMsR0FDYixPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUNwRSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDbkUsTUFBTSxPQUFPLEdBQ1gsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDakUsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLElBQUk7WUFDRixNQUFNLElBQUEsb0JBQVUsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDM0IsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDekMsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxPQUFPLENBQU0sRUFBRTtZQUNmLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxlQUFlO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzVDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUNEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsSUFBQSxrQkFBTyxFQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsZUFBZTtRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNELGtCQUFrQjtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDRDs7O09BR0c7SUFDSCxvQkFBb0I7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLElBQUEsNkJBQXFCLEVBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUEsNkJBQXFCLEVBQ25CLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLENBQUMsQ0FDekQsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN6QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQztBQUVGOzs7R0FHRztBQUNILFNBQWdCLElBQUksS0FBSSxDQUFDO0FBQXpCLG9CQUF5QjtBQUV6Qjs7O0dBR0c7QUFDSCxTQUFnQixNQUFNLEtBQUksQ0FBQztBQUEzQix3QkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVsZXRlVW51c2VkTWV0YUZpbGVzIH0gZnJvbSBcIi4vdXRpbHMvY2xlYW5cIjtcbmltcG9ydCB7IHJ1bkNvbW1hbmQgfSBmcm9tIFwiLi91dGlscy9jb21tYW5kXCI7XG5pbXBvcnQgdGlueVBuZyBmcm9tIFwiLi91dGlscy90aW55LXBuZ1wiO1xuXG4vKipcbiAqIEBlbiBSZWdpc3RyYXRpb24gbWV0aG9kIGZvciB0aGUgbWFpbiBwcm9jZXNzIG9mIEV4dGVuc2lvblxuICogQHpoIOS4uuaJqeWxleeahOS4u+i/m+eoi+eahOazqOWGjOaWueazlVxuICovXG5leHBvcnQgY29uc3QgbWV0aG9kczogeyBba2V5OiBzdHJpbmddOiAoLi4uYW55OiBhbnkpID0+IGFueSB9ID0ge1xuICAvKipcbiAgICogQGVuIEdlbmVyYXRlIGNvbmZpZ1xuICAgKiBAemgg55Sf5oiQ6YWN572uXG4gICAqL1xuICBhc3luYyBnZW5lcmF0ZUNvbmZpZygpIHtcbiAgICBjb25zb2xlLmxvZyhcIuW8gOWni+eUn+aIkOmFjee9rlwiKTtcbiAgICBjb25zdCBzY3JpcHREaXIgPVxuICAgICAgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gXCJzY3JpcHRzL3dpbmRvd3NcIiA6IFwic2NyaXB0cy91bml4XCI7XG4gICAgY29uc3Qgc2NyaXB0ID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gXCJnZW4uYmF0XCIgOiBcImdlbi5zaFwiO1xuICAgIGNvbnN0IGNvbW1hbmQgPVxuICAgICAgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gYCR7c2NyaXB0RGlyfS8ke3NjcmlwdH1gIDogXCJzaFwiO1xuICAgIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBbXSA6IFtgJHtzY3JpcHREaXJ9LyR7c2NyaXB0fWBdO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBydW5Db21tYW5kKGNvbW1hbmQsIGFyZ3MsIHsgY3dkOiBFZGl0b3IuUHJvamVjdC5wYXRoIH0pO1xuICAgICAgY29uc29sZS5sb2coXCLphY3nva7nlJ/miJDlrozmr5VcIik7XG4gICAgICBFZGl0b3IuRGlhbG9nLmluZm8oXCLphY3nva7nlJ/miJDlrozmr5VcIiwge1xuICAgICAgICBidXR0b25zOiBbRWRpdG9yLkkxOG4udChcImFzc2lzdGFudC5va1wiKV0sXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGF3YWl0IEVkaXRvci5EaWFsb2cuZXJyb3IoXCLphY3nva7nlJ/miJDlpLHotKVcIiwge1xuICAgICAgICBkZXRhaWw6IGAke2UubWVzc2FnZX1cXG7vvIjmiZPlvIDmjqfliLblj7Dmn6XnnIvor6bmg4XvvIlgLFxuICAgICAgICBidXR0b25zOiBbRWRpdG9yLkkxOG4udChcImFzc2lzdGFudC5jbG9zZVwiKV0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBAZW4gQ29tcHJlc3MgcGljdHVyZXNcbiAgICogQHpoIOWOi+e8qeWbvueJh1xuICAgKi9cbiAgYXN5bmMgY29tcHJlc3NQaWN0dXJlcygpIHtcbiAgICB0aW55UG5nKHBhdGguam9pbihFZGl0b3IuUHJvamVjdC5wYXRoLCBcInRlc3RcIikpO1xuICB9LFxuICBwdWJsaXNoVG9XZUNoYXQoKSB7XG4gICAgY29uc29sZS5sb2coXCLlj5HluIPliLDlvq7kv6HlsI/muLjmiI9cIik7XG4gIH0sXG4gIHB1Ymxpc2hUb0J5dGVEYW5jZSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIuWPkeW4g+WIsOWtl+iKguWwj+a4uOaIj1wiKTtcbiAgfSxcbiAgLyoqXG4gICAqIEBlbiBDbGVhbiB1bnVzZWQgbWV0YSBmaWxlc1xuICAgKiBAemgg5riF55CG5pyq5L2/55So55qEIG1ldGEg5paH5Lu2XG4gICAqL1xuICBjbGVhblVudXNlZE1ldGFGaWxlcygpIHtcbiAgICBjb25zb2xlLmxvZyhcIuW8gOWni+a4heeQhuacquS9v+eUqOeahCBtZXRhIOaWh+S7tlwiKTtcbiAgICBkZWxldGVVbnVzZWRNZXRhRmlsZXMocGF0aC5qb2luKEVkaXRvci5Qcm9qZWN0LnBhdGgsIFwiYXNzZXRzXCIpKTtcbiAgICBkZWxldGVVbnVzZWRNZXRhRmlsZXMoXG4gICAgICBwYXRoLmpvaW4oRWRpdG9yLlByb2plY3QucGF0aCwgXCJleHRlbnNpb25zL2NvcmUvYXNzZXRzXCIpXG4gICAgKTtcbiAgICBFZGl0b3IuRGlhbG9nLmluZm8oXCLmuIXnkIblrozmr5VcIiwge1xuICAgICAgYnV0dG9uczogW0VkaXRvci5JMThuLnQoXCJhc3Npc3RhbnQub2tcIildLFxuICAgIH0pO1xuICB9LFxufTtcblxuLyoqXG4gKiBAZW4gTWV0aG9kIFRyaWdnZXJlZCBvbiBFeHRlbnNpb24gU3RhcnR1cFxuICogQHpoIOaJqeWxleWQr+WKqOaXtuinpuWPkeeahOaWueazlVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZCgpIHt9XG5cbi8qKlxuICogQGVuIE1ldGhvZCB0cmlnZ2VyZWQgd2hlbiB1bmluc3RhbGxpbmcgdGhlIGV4dGVuc2lvblxuICogQHpoIOWNuOi9veaJqeWxleaXtuinpuWPkeeahOaWueazlVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkge31cbiJdfQ==