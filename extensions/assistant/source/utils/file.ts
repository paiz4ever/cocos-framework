import path from "path";
import fs from "fs";

export function ensureDirectoryExistence(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
