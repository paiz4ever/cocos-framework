import fs from "fs";
import https from "https";
import path from "path";
import { URL } from "url";
import crypto from "crypto";
import { ensureDirectoryExistence } from "./file";

const FILE_SUFFIX = [".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const TINYPNG_CACHE_FILE = path.join(
  Editor.Project.path,
  "caches/tinypng.json"
);

interface IResponse {
  input: {
    size: number;
    type: string;
  };
  output: {
    size: number;
    type: string;
    width: number;
    height: number;
    ratio: number;
    url: string;
  };
  error: string;
  message: string;
}

const OPTIONS = {
  method: "POST",
  hostname: "tinypng.com",
  path: "/backend/opt/shrink",
  headers: {
    rejectUnauthorized: false as any,
    "Postman-Token": Date.now(),
    "Cache-Control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
  },
} as https.RequestOptions;

function getRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(
    "."
  );
}

function fileEach(dir: string, callback: (filePath: string) => any) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        fileEach(filePath, callback);
      } else if (
        // 必须是文件，小于5MB，后缀 jpg 或 png
        stats.size <= MAX_FILE_SIZE &&
        stats.isFile() &&
        FILE_SUFFIX.includes(path.extname(file))
      ) {
        callback(filePath);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function getFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

function loadCache(): Record<string, string> {
  if (fs.existsSync(TINYPNG_CACHE_FILE)) {
    const cacheData = fs.readFileSync(TINYPNG_CACHE_FILE, "utf-8");
    return JSON.parse(cacheData);
  }
  return {};
}

function saveCache(cache: Record<string, string>) {
  ensureDirectoryExistence(TINYPNG_CACHE_FILE);
  fs.writeFileSync(TINYPNG_CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function fileUpload(imgPath: string): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    OPTIONS.headers!["X-Forwarded-For"] = getRandomIP();
    const req = https.request(OPTIONS, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data) as IResponse;
          if (parsedData.error) {
            reject(new Error(parsedData.message));
          } else {
            resolve(parsedData);
          }
        } catch (error) {
          reject(new Error("Failed to parse response JSON"));
        }
      });
    });
    req.on("error", reject);
    const fileStream = fs.createReadStream(imgPath);

    fileStream.on("error", (err) => {
      req.destroy(err);
      reject(err);
    });
    fileStream.on("end", () => {
      req.end();
    });
    fileStream.pipe(req);
  });
}

async function fileUpdate(
  imgPath: string,
  resp: IResponse
): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    const options = new URL(resp.output.url);
    const req = https.request(options, (res) => {
      const fileStream = fs.createWriteStream(imgPath, { encoding: "binary" });
      res.setEncoding("binary");
      res.pipe(fileStream);
      fileStream.on("finish", () => resolve(resp));
      fileStream.on("error", (err) => {
        req.destroy(err);
        reject(err);
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function toSize(b: number) {
  if (b < 1024) {
    return b + "B";
  } else if (b < 1024 * 1024) {
    return (b / 1024).toFixed(2) + "KB";
  } else {
    return (b / 1024 / 1024).toFixed(2) + "MB";
  }
}

function toPercent(num: number) {
  return (num * 100).toFixed(2) + "%";
}

async function fileTiny(filePath: string) {
  try {
    const response = await fileUpload(filePath);
    return await fileUpdate(filePath, response);
  } catch (error) {
    throw error;
  }
}

export default async function (dir: string) {
  if (!fs.existsSync(dir)) {
    console.error(`目录不存在：${dir}`);
    return;
  }
  const cache = loadCache();
  const basename = path.basename(dir);
  console.log(`[${basename}] 压缩中...`);
  const stats = fs.statSync(dir);
  if (stats.isFile()) {
    const ext = path.extname(dir);
    if (!FILE_SUFFIX.includes(ext)) {
      console.log(`[${basename}] 压缩失败：只支持png、jpg与jpeg格式`);
      return;
    }
    const fileHash = getFileHash(dir);
    if (cache[dir] === fileHash) {
      console.log(`[${basename}] 已经压缩过，跳过`);
      return;
    }
    try {
      const resp = await fileTiny(dir);
      cache[dir] = getFileHash(dir);
      saveCache(cache);
      console.log(
        "[1/1]",
        `[${basename}]`,
        `压缩成功，原始大小：${toSize(resp.input.size)}，压缩大小：${toSize(
          resp.output.size
        )}，压缩了：${toPercent(
          (resp.input.size - resp.output.size) / resp.input.size
        )}`
      );
    } catch (err) {
      console.log("[1/1]", `[${basename}]`, `压缩失败：${err}`);
    }
  } else if (stats.isDirectory()) {
    let total = 0;
    let finished = 0;
    fileEach(dir, async (filePath) => {
      const relativePath = path.join(basename, path.relative(dir, filePath));
      const fileHash = getFileHash(filePath);
      if (cache[filePath] === fileHash) {
        console.log(`[${relativePath}] 已经压缩过，跳过`);
        return;
      }
      total++;
      try {
        const resp = await fileTiny(filePath);
        cache[filePath] = getFileHash(filePath);
        saveCache(cache);
        console.log(
          `[${++finished}/${total}]`,
          `[${relativePath}]`,
          `压缩成功，原始大小：${toSize(resp.input.size)}，压缩大小：${toSize(
            resp.output.size
          )}，压缩了：${toPercent(
            (resp.input.size - resp.output.size) / resp.input.size
          )}`
        );
      } catch (err) {
        console.log(
          `[${++finished}/${total}]`,
          `[${relativePath}]`,
          `压缩失败：${err}`
        );
      }
    });
  }
}
