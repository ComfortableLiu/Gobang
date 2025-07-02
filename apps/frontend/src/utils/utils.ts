import { message } from "antd";

/**
 * 生成随机字符串
 * @param length 字符串长度
 */
export function randomString(length = 1) {
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
  let a = t.length
  let n = ""
  for (let i = 0; i < length; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

/**
 * 将content参数内容复制到粘贴板中
 * @param {String} content
 * @return {Promise}
 */
export function clipboard(content: string | number): Promise<void> {
  const copySuccess = '复制成功'
  const copyFail = '复制失败'
  if (navigator.clipboard && window.isSecureContext) {
    return new Promise((resolve, reject) => {
      navigator.clipboard.writeText(String(content)).then(() => {
        message.success(copySuccess)
        resolve()
      }).catch(() => {
        message.error(copyFail)
        reject()
      })
    })
  }
  return new Promise((resolve, reject) => {
    // 动态创建 textarea 标签
    const textarea = document.createElement('textarea') as any
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = 'readonly'
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    // 网上有些例子是赋值给innerText,这样也会赋值成功，但是识别不了\r\n的换行符，赋值给value属性就可以
    textarea.value = content
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    if (document.execCommand('copy')) {
      document.execCommand('Copy')
      message.success(copySuccess)
      resolve()
    } else {
      message.error(copyFail)
      reject()
    }
    document.body.removeChild(textarea)
  })
}
