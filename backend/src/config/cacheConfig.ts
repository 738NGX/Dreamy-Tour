import NodeCache from "node-cache";

// 全局缓存（暂时就验证码使用，默认 1 周过期）
const globalCache = new NodeCache({ stdTTL: 3600 * 24 * 7});

export default globalCache;