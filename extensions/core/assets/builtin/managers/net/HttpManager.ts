/**
 * 对Http请求的封装，兼容各平台
 */
import { getMiniGameGlobalVariable } from "../../../utils/platform";

export class HttpMgr {
  static post<T = any>(options: IHttpOptions): Promise<T> {
    return this.rpc("POST", options);
  }

  static get<T = any>(options: IHttpOptions): Promise<T> {
    return this.rpc("GET", options);
  }

  private static rpc(
    method: "POST" | "GET",
    options: IHttpOptions
  ): Promise<any> {
    let { url, data } = options;
    let env = getMiniGameGlobalVariable();
    if (env) {
      return new Promise((resolve, reject) => {
        env.request({
          url,
          data,
          header: {
            "content-type": "application/json",
          },
          method,
          success: (res) => resolve(res.data),
          fail: reject,
        });
      });
    }
    let fetchFunc = typeof fetch !== "undefined" ? fetch : this.fetchWithXHR;
    if (method === "GET") {
      if (data) {
        url +=
          "?" +
          Object.keys(data)
            .map((k) => `${k}=${data[k]}`)
            .join("&");
      }
      return fetchFunc(url, {
        method,
      }).then((resp) => resp.json());
    } else if (method === "POST") {
      return fetchFunc(url, {
        method,
        body: JSON.stringify(data || {}),
        headers: { "Content-Type": "application/json" },
      }).then((resp) => resp.json());
    }
  }

  private static fetchWithXHR(url, options: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || "GET", url, true);
      // 设置请求头
      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }
      // 设置响应类型
      if (options.responseType) {
        xhr.responseType = options.responseType;
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            ok: true,
            status: xhr.status,
            statusText: xhr.statusText,
            json: () => Promise.resolve(JSON.parse(xhr.responseText)),
            text: () => Promise.resolve(xhr.responseText),
            blob: () => Promise.resolve(new Blob([xhr.response])),
            arrayBuffer: () => Promise.resolve(xhr.response),
            // @ts-ignore
            headers: {
              get: (header) => xhr.getResponseHeader(header),
            },
            url: xhr.responseURL,
          });
        } else {
          reject({
            ok: false,
            status: xhr.status,
            statusText: xhr.statusText,
            json: () => Promise.resolve(JSON.parse(xhr.responseText)),
            text: () => Promise.resolve(xhr.responseText),
            blob: () => Promise.resolve(new Blob([xhr.response])),
            arrayBuffer: () => Promise.resolve(xhr.response),
            headers: {
              get: (header) => xhr.getResponseHeader(header),
            },
            url: xhr.responseURL,
          });
        }
      };
      xhr.onerror = () => {
        reject({
          ok: false,
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };
      xhr.ontimeout = () => {
        reject({
          ok: false,
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };
      // 发送请求
      if (options.body) {
        xhr.send(options.body);
      } else {
        xhr.send();
      }
    });
  }
}
