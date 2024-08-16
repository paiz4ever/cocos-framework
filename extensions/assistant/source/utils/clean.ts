import fs from "fs";
import path from "path";

export function deleteUnusedMetaFiles(dir: string): void {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    // 如果是目录，递归处理
    if (fs.statSync(filePath).isDirectory()) {
      deleteUnusedMetaFiles(filePath);
    } else if (file.endsWith(".meta")) {
      const correspondingFile = filePath.replace(/\.meta$/, "");
      if (!fs.existsSync(correspondingFile)) {
        fs.unlinkSync(filePath);
        console.log(`删除: ${filePath}`);
      }
    }
  });
}
