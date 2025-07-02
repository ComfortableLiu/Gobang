import { getLocalstorage, setLocalstorage } from "../utils/storage";
import { randomString } from "../utils/utils";

const application = {
  /**
   * 检查是否存在设备ID
   * 设备id格式为 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx，仅包含大小写字母及数字
   */
  checkDeviceId: () => {
    // 本地拿一下
    const deviceId = getLocalstorage<string>('deviceId')
    // 有就直接返回就行
    if (deviceId) return

    // 没有就生成一个新的存起来
    const s = `${randomString(8)}-${randomString(4)}-${randomString(4)}-${randomString(4)}-${randomString(12)}`
    setLocalstorage('deviceId', s)
  }
}

export default application
