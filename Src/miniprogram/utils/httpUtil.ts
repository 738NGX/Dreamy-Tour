// API 地址配置
const usingDomain = true;   // 是否使用域名
const usingLocal = false;   // 是否使用本地 IP
export const apiUrl = usingLocal ? "http://127.0.0.1:8080" : (
  usingDomain
    ? "https://dreamy-tour.738ngx.site/api"
    : "http://117.72.15.170/api"
);

import { Fly as IFly } from "./fly/fly"
var Fly = require("./fly/fly.min")
const fly = new Fly() as IFly;

const debug = usingLocal || true; // 是否开启调试模式
console.log("debug:", debug);
console.log("apiUrl:", apiUrl);

/**
 * 所有请求的参数类型
 */
type Request = {
  // 基础 URL，所有请求的 URL 都以这个开头，默认为 http://117.72.15.170/api
  baseUrl?: string;
  // 请求的 URL，如果是相对路径，会自动拼接 baseUrl；如果是绝对路径，则直接发请求
  url: string;
  // 请求头
  header?: Record<string, any>;
  // 请求方法
  method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "PATCH" | undefined;
  // 请求参数
  params?: Record<string, string>;
  // 请求体的参数（统一都用 JSON）
  jsonData?: Record<string, number | string | string[] | any>;
}

/**
 * 某一具体方法请求的参数类型（把 method 删了）
 */
type MethodRequest = {
  // 基础 URL，所有请求的 URL 都以这个开头，默认为 http://117.72.15.170/api
  baseUrl?: string;
  // 请求的 URL，如果是相对路径，会自动拼接 baseUrl；如果是绝对路径，则直接发请求
  url: string;
  // 请求头
  header?: Record<string, any>;
  // 请求参数
  params?: Record<string, string>;
  // 请求体的参数（统一都用 JSON）
  jsonData?: Record<string, number | string | string[] | any>;
}

/**
 * 响应数据封装
 */
type ResponseData = {
  // 0 表示响应异常；1 表示响应正常
  code: 0 | 1;
  // 提示消息
  msg: string;
  // 响应数据
  data: any
}

/**
 * 封装响应
 */
type Response = {
  // 响应数据
  data: ResponseData;
  // 响应状态码
  status: number;
  // 响应头
  headers: object;
  // cookies，格式为字符串数组
  cookies?: Array<string>;
}

// HTTP 请求工具类
class HttpUtil {
  // 基础 URL
  static readonly baseUrl = apiUrl;

  /**
   * 发送网络请求（支持 Token 校验和自动跳转登录）
   * @param req 请求配置
   */
  static async request(req: Request): Promise<Response> {
    wx.showLoading({
      title: "请稍候..."
    });
    // ================== Token 校验逻辑 ==================
    if (!req.url.endsWith("/wx-login")) {
      const token = wx.getStorageSync("token");

      // 场景 1: 无 Token 直接跳转登录
      if (!token) {
        wx.redirectTo({ url: "/pages/login/login" });
        return Promise.reject({ errMsg: "缺少 Token，已跳转登录页" });
      }

      // 场景 2: 合并 Authorization 请求头
      req.header = {
        ...req.header,          // 保留原有 headers
        Authorization: token    // 强制覆盖 Authorization
      };
    }

    // ================== 构建请求参数 ==================
    const requestParams: WechatMiniprogram.RequestOption = {
      url: this.getUrl(req.url, req.params),
      method: (req.method || "GET").toUpperCase() as any, // 默认为 GET
      header: req.header || {},
      data: req.jsonData
    };

    if (debug) { console.log('backend request:', requestParams) };

    // ================== 发送请求 ==================
    return new Promise(async (resolve, reject) => {
      try {
        const d = await fly.request(
          requestParams.url,
          requestParams.data,
          {
            method: requestParams.method,
            headers: requestParams.header,
            timeout: 180000
          }
        );
        if (debug) { console.log('backend result:', d) };
        // 检查响应头是否有 X-Refresh-Token，如果有，刷新本地 token
        const headers = d.headers as { [key: string]: string | undefined };
        if (headers["X-Refresh-Token"]) {
          wx.setStorageSync("token", headers["X-Refresh-Token"])
        }
        wx.hideLoading();
        resolve(d);
      } catch (e: any) {
        wx.hideLoading();
        if (debug) { console.error('backend error:', e) };
        if (e.status === 1) {
          wx.showToast({ title: "请求超时", icon: "error", time: 2000 });
        } else if (e.status === 400) {
          e = { ...e, errMsg: "请求参数错误" };
        } else if (e.status === 401) {
          wx.removeStorageSync("token");  // 清除失效 Token
          wx.redirectTo({ url: "/pages/login/login" });
          wx.showToast({ title: "登陆已过期", icon: "error", time: 2000 });
          e = { ...e, errMsg: "登录已过期" };
        } else if (e.status >= 500) {
          wx.showToast({ title: "服务器异常", icon: "error", time: 2000 });
          e = { ...e, errMsg: "服务器异常" };
        }
        reject(e);
      }
      /** 微信原生, 已弃用
      wx.request({
        ...requestParams,
        success: (res: Response) => {
          // 场景 3: Token 失效统一处理
          if (res.statusCode === 401) {
            wx.removeStorageSync("token");  // 清除失效 Token
            wx.redirectTo({ url: "/pages/login/login" });
            reject({ ...res, errMsg: "Token 失效，请重新登录" });
          } else if (res.statusCode > 500) {
            reject({ ...res, errMsg: "服务器异常" });
          }
          else {
            resolve(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
      */
    });
  }

  /**
   * GET 请求
   * @param req 请求配置
   */
  static async get(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "GET"
    })
  }

  /**
   * POST 请求（提交数据）
   * @param req 请求配置（数据放在 json_data）
   */
  static async post(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "POST"
    })
  }

  /**
   * PUT 请求（全量更新资源）
   * @param req 请求配置
   */
  static async put(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "PUT"
    })
  }

  /**
   * DELETE 请求（删除资源）
   * @param req 请求配置
   */
  static async delete(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "DELETE"
    })
  }

  /**
   * PATCH 请求（部分更新资源）
   * @param req 请求配置
   */
  static async patch(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "PATCH"
    })
  }

  /**
   * OPTIONS 请求（获取通信选项）
   * @param req 请求配置
   */
  static async options(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "OPTIONS"
    })
  }

  /**
   * HEAD 请求（获取报文头）
   * @param req 请求配置
   */
  static async head(req: MethodRequest): Promise<Response> {
    return await this.request({
      ...req,
      method: "HEAD"
    })
  }
  /**
   * 设置 URL，补全 baseUrl 和传参
   * @param url 
   * @param params
   */
  private static getUrl(url: string, params?: Record<string, string>): string {
    // 判断绝对路径（兼容 http/https 任意大小写）
    const isAbsolute = /^https?:\/\//i.test(url);

    // 处理 baseUrl 和路径拼接
    let fullUrl: string;
    if (isAbsolute) {
      fullUrl = url;
    } else {
      // 确保 baseUrl 以斜杠结尾，url 不以斜杠开头
      const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
      const adjustedUrl = url.startsWith('/') ? url.slice(1) : url;
      fullUrl = base + adjustedUrl;
    }

    // 如果没有参数直接返回
    if (!params) {
      return fullUrl;
    }

    // 分解哈希和查询参数
    const [pathWithQuery, hash] = fullUrl.split('#');
    const [path, existingQuery] = pathWithQuery.split('?');

    // 解析已有查询参数
    const queryParams: Record<string, string> = {};
    if (existingQuery) {
      existingQuery.split('&').forEach(pair => {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        queryParams[key] = value;
      });
    }

    // 合并参数（新参数覆盖旧参数）
    const mergedParams = { ...queryParams, ...params };

    // 生成查询字符串（自动编码特殊字符）
    const queryString = Object.entries(mergedParams)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    // 拼接最终 URL
    let finalUrl = path;
    if (queryString) finalUrl += `?${queryString}`;
    if (hash) finalUrl += `#${hash}`;

    return finalUrl;
  }
}

export default HttpUtil;