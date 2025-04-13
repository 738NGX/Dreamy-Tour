class LoadUtil {
  // 当前正在请求的个数（保证不会为负数）
  static requestCounts = 0;
  // 是否正在显示加载特效
  static isLoading = false;
  // 延迟加载定时器
  static loadingTimer: number | null = null;

  static show() {
    this.requestCounts++;
    // 每次调用 show 都重置定时器实现防抖
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
    
    this.loadingTimer = setTimeout(() => {
      // 延迟后检查是否仍有未完成的请求
      if (this.requestCounts > 0 && !this.isLoading) {
        this.isLoading = true;
        wx.showLoading({
          title: "请稍候...",
          mask: true
        });
      }
    }, 150) as unknown as number;
  }

  static hide() {
    // 保证请求计数不会为负数
    this.requestCounts = Math.max(this.requestCounts - 1, 0);
    
    // 立即清除定时器防止无效显示
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }

    // 当没有请求且正在加载时，立即隐藏
    if (this.requestCounts === 0 && this.isLoading) {
      wx.hideLoading();
      this.isLoading = false;
    }
  }
}

export default LoadUtil;