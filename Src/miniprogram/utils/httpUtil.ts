const usingDomain = true; // 是否使用域名
export const apiUrl =  usingDomain ? "https://dreamy-tour.738ngx.site/api" : "http://117.72.15.170/api";

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
  jsonData?: Record<string, string>;
  // 表单请求参数
  formData?: Record<string, string>;
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
  jsonData?: Record<string, string>;
  // 表单请求参数
  formData?: Record<string, string>;
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
  statusCode: number;
  // 响应头
  header: object;
  // cookies，格式为字符串数组
  cookies: Array<string>;
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
        ...req.header,  // 保留原有 headers
        Authorization: token   // 强制覆盖 Authorization
      };
    }

    // ================== 构建请求参数 ==================
    const requestParams: WechatMiniprogram.RequestOption = {
      url: this.getUrl(req.url, req.params),
      method: (req.method || "GET").toUpperCase() as any, // 默认为 GET
      header: req.header || {},
      data: req.jsonData
    };

    // ================== 发送请求 ==================
    return new Promise((resolve, reject) => {
      wx.request({
        ...requestParams,
        success: (res: Response) => {
          // 场景 3: Token 失效统一处理
          if (res.statusCode === 401) {
            wx.removeStorageSync("token");  // 清除失效 Token
            wx.redirectTo({ url: "/pages/login/login" });
            reject({ ...res, errMsg: "Token 失效，请重新登录" });
          } else {
            resolve(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
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