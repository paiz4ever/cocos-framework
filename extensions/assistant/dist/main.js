"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const utils_1 = require("./utils");
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
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
        const scriptDir = process.platform === "win32" ? "scripts/windows" : "scripts/unix";
        const script = process.platform === "win32" ? "gen.bat" : "gen.sh";
        const command = process.platform === "win32" ? `${scriptDir}/${script}` : "sh";
        const args = process.platform === "win32" ? [] : [`${scriptDir}/${script}`];
        try {
            await (0, utils_1.runCommand)(command, args, { cwd: Editor.Project.path });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxQztBQUVyQzs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDOUQ7OztPQUdHO0lBQ0gsbUJBQW1CO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELGNBQWM7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sU0FBUyxHQUNiLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3BFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNuRSxNQUFNLE9BQU8sR0FDWCxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqRSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDNUUsSUFBSTtZQUNGLE1BQU0sSUFBQSxrQkFBVSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUMzQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUN6QyxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU8sQ0FBTSxFQUFFO1lBQ2YsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLGVBQWU7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDNUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0NBQ0YsQ0FBQztBQUVGOzs7R0FHRztBQUNILFNBQWdCLElBQUksS0FBSSxDQUFDO0FBQXpCLG9CQUF5QjtBQUV6Qjs7O0dBR0c7QUFDSCxTQUFnQixNQUFNLEtBQUksQ0FBQztBQUEzQix3QkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBydW5Db21tYW5kIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLyoqXG4gKiBAZW4gUmVnaXN0cmF0aW9uIG1ldGhvZCBmb3IgdGhlIG1haW4gcHJvY2VzcyBvZiBFeHRlbnNpb25cbiAqIEB6aCDkuLrmianlsZXnmoTkuLvov5vnqIvnmoTms6jlhozmlrnms5VcbiAqL1xuZXhwb3J0IGNvbnN0IG1ldGhvZHM6IHsgW2tleTogc3RyaW5nXTogKC4uLmFueTogYW55KSA9PiBhbnkgfSA9IHtcbiAgLyoqXG4gICAqIEBlbiBBIG1ldGhvZCB0aGF0IGNhbiBiZSB0cmlnZ2VyZWQgYnkgbWVzc2FnZVxuICAgKiBAemgg6YCa6L+HIG1lc3NhZ2Ug6Kem5Y+R55qE5pa55rOVXG4gICAqL1xuICBjbGVhblVudXNlZE1ldGFGaWxlKCkge1xuICAgIGNvbnNvbGUubG9nKFwi5riF55CG5aSa5L2Z55qEIG1ldGEg5paH5Lu2XCIpO1xuICB9LFxuICBidWlsZEFuZFVwbG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIuaehOW7uuW5tuS4iuS8oFwiKTtcbiAgfSxcbiAgYXN5bmMgZ2VuZXJhdGVDb25maWcoKSB7XG4gICAgY29uc29sZS5sb2coXCLlvIDlp4vnlJ/miJDphY3nva5cIik7XG4gICAgY29uc3Qgc2NyaXB0RGlyID1cbiAgICAgIHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IFwic2NyaXB0cy93aW5kb3dzXCIgOiBcInNjcmlwdHMvdW5peFwiO1xuICAgIGNvbnN0IHNjcmlwdCA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IFwiZ2VuLmJhdFwiIDogXCJnZW4uc2hcIjtcbiAgICBjb25zdCBjb21tYW5kID1cbiAgICAgIHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IGAke3NjcmlwdERpcn0vJHtzY3JpcHR9YCA6IFwic2hcIjtcbiAgICBjb25zdCBhcmdzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gW10gOiBbYCR7c2NyaXB0RGlyfS8ke3NjcmlwdH1gXTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcnVuQ29tbWFuZChjb21tYW5kLCBhcmdzLCB7IGN3ZDogRWRpdG9yLlByb2plY3QucGF0aCB9KTtcbiAgICAgIGNvbnNvbGUubG9nKFwi6YWN572u55Sf5oiQ5a6M5q+VXCIpO1xuICAgICAgRWRpdG9yLkRpYWxvZy5pbmZvKFwi6YWN572u55Sf5oiQ5a6M5q+VXCIsIHtcbiAgICAgICAgYnV0dG9uczogW0VkaXRvci5JMThuLnQoXCJhc3Npc3RhbnQub2tcIildLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBhd2FpdCBFZGl0b3IuRGlhbG9nLmVycm9yKFwi6YWN572u55Sf5oiQ5aSx6LSlXCIsIHtcbiAgICAgICAgZGV0YWlsOiBgJHtlLm1lc3NhZ2V9XFxu77yI5omT5byA5o6n5Yi25Y+w5p+l55yL6K+m5oOF77yJYCxcbiAgICAgICAgYnV0dG9uczogW0VkaXRvci5JMThuLnQoXCJhc3Npc3RhbnQuY2xvc2VcIildLFxuICAgICAgfSk7XG4gICAgfVxuICB9LFxufTtcblxuLyoqXG4gKiBAZW4gTWV0aG9kIFRyaWdnZXJlZCBvbiBFeHRlbnNpb24gU3RhcnR1cFxuICogQHpoIOaJqeWxleWQr+WKqOaXtuinpuWPkeeahOaWueazlVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZCgpIHt9XG5cbi8qKlxuICogQGVuIE1ldGhvZCB0cmlnZ2VyZWQgd2hlbiB1bmluc3RhbGxpbmcgdGhlIGV4dGVuc2lvblxuICogQHpoIOWNuOi9veaJqeWxleaXtuinpuWPkeeahOaWueazlVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkge31cbiJdfQ==