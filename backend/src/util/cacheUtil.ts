/*
 * 缓存相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-04-09 12:56:50 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 12:57:35
 */
import globalCache from "@/config/cacheConfig";


class CacheUtil {
  /**
   * 获取缓存中的所有 key-value
   * @returns 
   */
  static getAllCacheEntries(): Record<string, any> {
    const keys = globalCache.keys();
    const cacheObject: Record<string, any> = {};
  
    keys.forEach((key) => {
      cacheObject[key] = globalCache.get(key);
    });
  
    return cacheObject;
  }
}

export default CacheUtil;