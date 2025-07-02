/**
 * 本地存储封装
 * @param key
 * @param value
 */
export function setLocalstorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 获取本地存储
 * @param key
 */
export function getLocalstorage<T>(key: string): T | null {
  const value = localStorage.getItem(key)
  if (!value) return null
  return JSON.parse(value)
}
