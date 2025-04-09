/*
 * 邮箱相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-04-08 23:47:38 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 00:23:49
 */
import globalCache from "@/config/cacheConfig";
import emailServer from "@/config/emailConfig";
import AppConstant from "@/constant/appConstant";
import EmailConstant from "@/constant/emailConstant";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class EmailUtil {
  /**
   * 向某个邮箱发邮件
   * @param to 邮箱地址
   * @param subject 邮箱主题
   * @param text 邮箱正文
   * @returns 
   */
  static send(
    to: string, 
    subject: string, 
    text: string
  ): Promise<SMTPTransport.SentMessageInfo> {
    const mailOptions = {
      from: EmailConstant.FROM_EMAIL,
      to: to,
      subject: subject,
      text: text
    };

    return emailServer.sendMail(mailOptions);
  }

  /**
   * 发送验证码邮件（支持多种业务场景）
   * @param to 目标邮箱
   * @param options 配置选项
   * @returns 包含业务类型和验证码的对象
   */
  static async sendVerifyCode(
    to: string,
    options: {
      businessType?: "register" | "login" | "reset"; // 业务类型
      codeLength?: number;       // 验证码长度
      expiresIn?: number;        // 过期时间（秒）
      returnCode?: boolean;      // 是否返回验证码（仅建议测试使用）
    } = {}
  ): Promise<{ success: boolean; business?: string }> {
    // 参数合并默认值
    const {
      businessType = "register",
      codeLength = 6,
      expiresIn = 300,
      returnCode = false
    } = options;

    try {
      // 生成验证码
      const code = Array.from({ length: codeLength }, () => 
        Math.floor(Math.random() * 10)
      ).join('');

      // 存储到缓存（业务类型隔离存储）
      const cacheKey = `${businessType}:${to}`;
      globalCache.set(cacheKey, code, expiresIn);

      // 发送邮件
      await this.send(
        to,
        `【${AppConstant.APP_NAME}】${this.getBusinessTitle(businessType)}`,
        this.buildEmailContent(businessType, code, expiresIn)
      );

      // 仅在明确要求时返回验证码（生产环境应始终为false）
      return { 
        success: true,
        ...(returnCode && { business: cacheKey, code }) 
      };
    } catch (error) {
      console.error(`[${businessType}] 验证码发送失败:`, error);
      return { success: false };
    }
  }

  /**
   * 获取业务类型对应的标题
   * @param type 
   * @returns 
   */
  private static getBusinessTitle(type: string): string {
    const titles: Record<string, string> = {
      register: "注册验证码",
      login: "登录验证码",
      reset: "密码重置验证码"
    };
    return titles[type] || "安全验证码";
  }

  /**
   * 构建邮件的内容模板
   * @param type 
   * @param code 
   * @param expiresIn 
   * @returns 
   */
  private static buildEmailContent(
    type: string,
    code: string,
    expiresIn: number
  ): string {
    const minutes = Math.floor(expiresIn / 60);
    return `
尊敬的 ${AppConstant.APP_NAME} 用户：

您正在请求${this.getBusinessTitle(type)}，验证码为：
【 ${code} 】
该验证码 ${minutes} 分钟内有效，请勿泄露给他人。

如非本人操作，请忽略本邮件。
    `.trim();
  }

  /**
   * 验证码校验
   * @param email 邮箱地址
   * @param code 用户输入的验证码
   * @param businessType 业务类型
   */
  static verifyCode(
    email: string,
    code: string,
    businessType: string
  ): boolean {
    const cacheKey = `${businessType}:${email}`;
    const storedCode = globalCache.get(cacheKey);
    
    // 验证成功后立即删除验证码（防止重复使用）
    if (storedCode === code) {
      globalCache.del(cacheKey);
      return true;
    }
    return false;
  }
}

export default EmailUtil;