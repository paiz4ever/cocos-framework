"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnusedMetaFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function deleteUnusedMetaFiles(dir) {
    if (!fs_1.default.existsSync(dir))
        return;
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path_1.default.join(dir, file);
        // 如果是目录，递归处理
        if (fs_1.default.statSync(filePath).isDirectory()) {
            deleteUnusedMetaFiles(filePath);
        }
        else if (file.endsWith(".meta")) {
            const correspondingFile = filePath.replace(/\.meta$/, "");
            if (!fs_1.default.existsSync(correspondingFile)) {
                fs_1.default.unlinkSync(filePath);
                console.log(`删除: ${filePath}`);
            }
        }
    });
}
exports.deleteUnusedMetaFiles = deleteUnusedMetaFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvdXRpbHMvY2xlYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUV4QixTQUFnQixxQkFBcUIsQ0FBQyxHQUFXO0lBQy9DLElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUFFLE9BQU87SUFDaEMsTUFBTSxLQUFLLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDckIsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsYUFBYTtRQUNiLElBQUksWUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN2QyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqQzthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQ3JDLFlBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFoQkQsc0RBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVVudXNlZE1ldGFGaWxlcyhkaXI6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlyKSkgcmV0dXJuO1xuICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGRpcik7XG4gIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUpO1xuICAgIC8vIOWmguaenOaYr+ebruW9le+8jOmAkuW9kuWkhOeQhlxuICAgIGlmIChmcy5zdGF0U3luYyhmaWxlUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgZGVsZXRlVW51c2VkTWV0YUZpbGVzKGZpbGVQYXRoKTtcbiAgICB9IGVsc2UgaWYgKGZpbGUuZW5kc1dpdGgoXCIubWV0YVwiKSkge1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ0ZpbGUgPSBmaWxlUGF0aC5yZXBsYWNlKC9cXC5tZXRhJC8sIFwiXCIpO1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGNvcnJlc3BvbmRpbmdGaWxlKSkge1xuICAgICAgICBmcy51bmxpbmtTeW5jKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc29sZS5sb2coYOWIoOmZpDogJHtmaWxlUGF0aH1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuIl19