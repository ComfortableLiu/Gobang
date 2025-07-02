import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { SignatureConfig } from "./type";

class SignedAxios {
  private instance: AxiosInstance;
  private config: Required<SignatureConfig>;

  constructor(config: SignatureConfig) {
    // 配置默认值
    this.config = {
      encryptMethod: 'hmac-sha256',
      timeout: 10000,
      maxRetries: 2,
      retryDelay: 500,
      ...config
    };

    // 创建 Axios 实例
    this.instance = axios.create({
      url: `${this.config.host}:${this.config.port}`,
      baseURL: `/api`, // 设置基础路径
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 添加请求拦截器（用于签名）
    this.instance.interceptors.request.use(this.signRequest.bind(this))

    // 添加响应拦截器（用于错误处理）
    this.instance.interceptors.response.use(
      this.handleSuccessResponse.bind(this),
      this.handleErrorResponse.bind(this)
    );
  }

  // 使用 HMAC-SHA256 签名
  private async hmacSha256(message: string, secretKey: string) {
    const encoder = new TextEncoder();

    // 导入密钥
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // 签名
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );

    // 转换为十六进制字符串
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * 请求签名
   */
  private async signRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    // 获取签名所需参数
    const timestamp = Date.now();
    // 如果服务端支持，可以加一下nonce参数，这里先不加了
    // const nonce = uuidv4();
    const method = (config.method || 'GET').toUpperCase();

    // 准备签名数据
    const signData = {
      timestamp,
      // nonce,
      method,
      path: config.url || '',
      query: config.params || {},
      body: config.data || {}
    };

    // 1. 序列化参数（保持键顺序）
    const sortedEntries = Object.entries(signData)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    // 2. 构建签名字符串
    let signString = sortedEntries.map(([key, value]) => {
      // 处理嵌套对象
      if (typeof value === 'object' && value !== null) {
        return `${key}=${JSON.stringify(value)}`;
      }
      return `${key}=${value}`;
    }).join('&');

    // 3. 生成签名
    let signature: string = await this.hmacSha256(signString, this.config.signatureSecret);

    // 设置请求头
    config.headers = config.headers || {};
    config.headers['X-Signature'] = signature;
    config.headers['X-Timestamp'] = timestamp;
    // config.headers['X-Nonce'] = nonce;

    return config;
  }

  /**
   * 处理成功响应
   */
  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    // 验证服务器响应签名（可选）
    this.verifyResponseSignature(response)
    return response;
  }

  /**
   * 验证响应签名
   */
  private async verifyResponseSignature(response: AxiosResponse): Promise<void> {
    const resSignature = response.headers['x-response-signature'];

    if (!resSignature) return;

    // 提取签名数据
    const { data, status } = response;
    const timestamp = response.headers['x-response-timestamp'];

    // 计算签名
    const signString = `status=${status}&data=${JSON.stringify(data)}&timestamp=${timestamp}`;
    const calculatedSignature = await this.hmacSha256(signString, this.config.signatureSecret)

    // 安全比较
    if (!this.secureCompare(resSignature, calculatedSignature)) {
      throw new Error('Invalid response signature');
    }
  }

  /**
   * 安全比较
   */
  private timingSafeEqual(a: string, b: string) {
    const aBytes = new TextEncoder().encode(a);
    const bBytes = new TextEncoder().encode(b);

    const length = Math.max(aBytes.length, bBytes.length);

    let result = 0;

    for (let i = 0; i < length; i++) {
      const aByte = i < aBytes.length ? aBytes[i] : 0;
      const bByte = i < bBytes.length ? bBytes[i] : 0;

      result |= aByte ^ bByte;
    }
    return result === 0 && aBytes.length === bBytes.length;
  }

  /**
   * 安全比较（防时序攻击）
   */
  private secureCompare(a: string, b: string): boolean {
    try {
      return a.length === b.length && this.timingSafeEqual(a, b)
    } catch (_e) {
      return false
    }
  }

  /**
   * 处理错误响应
   */
  private async handleErrorResponse(error: AxiosError) {
    // 这里可以加签名过期的重试逻辑

    // const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    // // 初始化重试次数
    // config._retryCount = config._retryCount || 0;
    //
    // // 签名过期重试
    // const shouldRetry =
    //   config._retryCount < this.config.maxRetries &&
    //   error.response?.status === 401 &&
    //   error.response?.data?.code === 'SIGNATURE_EXPIRED';
    //
    // if (shouldRetry) {
    //   config._retryCount++;
    //
    //   // 延迟重试
    //   await new Promise(resolve =>
    //     setTimeout(resolve, this.config.retryDelay * config._retryCount));
    //   return this.instance.request(config);
    // }

    // 处理其他错误
    throw this.normalizeError(error);
  }

  /**
   * 规范化错误对象
   */
  private normalizeError(error: AxiosError) {
    if (error.response) {
      // 服务器返回错误 (4xx/5xx)
      const { status, data } = error.response;
      return {
        status,
        message: data?.message || 'Server error',
        code: data?.code || 'SERVER_ERROR',
        data: data?.data,
        isNetworkError: false
      };
    } else if (error.request) {
      // 请求发出但没有响应
      return {
        status: 0,
        message: 'Network error',
        code: 'NETWORK_ERROR',
        isNetworkError: true
      };
    } else {
      // 请求配置错误
      return {
        status: 0,
        message: 'Request setup error',
        code: 'REQUEST_ERROR',
        isNetworkError: false
      };
    }
  }

  /**
   * 封装 HTTP 方法
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config).then(r => r.data);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config).then(r => r.data);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config).then(r => r.data);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config).then(r => r.data);
  }

  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request<T>(config).then(r => r.data);
  }

  /**
   * 文件上传方法
   */
  public upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * 添加全局请求头
   */
  public setHeader(key: string, value: string): void {
    this.instance.defaults.headers.common[key] = value;
  }
}

// 配置文件（从环境变量获取）
const SIGNATURE_SECRET = process.env.SIGNATURE_SECRET || '';
const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '3001');

// 创建实例
const rest = new SignedAxios({
  host: HOST,
  port: PORT,
  signatureSecret: SIGNATURE_SECRET,
  // 预留字段，目前仅使用hmac-sha256，后面可扩展其他算法
  encryptMethod: 'hmac-sha256',
  timeout: 15000,
  maxRetries: 3
});

export default rest
