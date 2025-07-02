import { CancelToken, ResponseType } from "axios";

export interface IOption {
  responseType?: ResponseType; // 返回类型
  url: string; // 接口url
  method: 'get' | 'post' | 'delete' | 'put'; // 目前就封装了这四种，多了再改
  cancelToken?: CancelToken;
  headers?: {
    [key: string]: any;
  };
  // url上参数，get用，实际上最后会合并，用哪个都行
  params?: {
    [key: string]: any;
  };
  // 请求体里面参数，post用，实际上最后会合并，用哪个都行
  data?: {
    [key: string]: any;
  };
  // 是否忽略业务错误
  // 默认行为是遇到错误，自动toast展示message字段，忽略后，无论任何错误，都不进行提示
  missBusinessError?: boolean
  // 是否忽略网络错误
  // 默认行为是遇到错误，自动toast展示message字段，忽略后，无论任何错误，都不进行提示
  missNetError?: boolean
}

export interface IResult<T> {
  code: string | number;
  msg: string;
  data: T;
}

/**
 * 签名配置文件
 */
export interface SignatureConfig {
  signatureSecret: string
  host: string
  port: number
  // 超时时间
  timeout?: number
  // 预留参数，重试延迟(ms)
  retryDelay?: number
  // 预留参数，最大重试次数
  maxRetries?: number
  // 预留参数，加密方式
  encryptMethod?: 'hmac-sha256' | 'hmac-sha512' | 'md5'
}
