/*
 * 邮箱相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-04-08 23:47:38 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 19:54:13
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
      html: text
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
      businessType?: "register" | "login" | "reset" | "bind"; // 业务类型
      codeLength?: number;       // 验证码长度
      expiresIn?: number;        // 过期时间（秒）
      returnCode?: boolean;      // 是否返回验证码（仅建议测试使用）
      reminder?: string;         // 提醒用户的注意事项
    } = {}
  ): Promise<{ success: boolean; business?: string }> {
    // 参数合并默认值
    const {
      businessType = "register",
      codeLength = 6,
      expiresIn = 300,
      returnCode = false,
      reminder = "此操作可能会修改您的账户重要信息。如非本人操作，请立即登录修改密码"
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
        this.buildEmailContent(businessType, code, expiresIn, reminder)
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
      register: "注册账号",
      login: "登录账号",
      reset: "密码重置",
      bind: "绑定邮箱"
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
    expiresIn: number,
    reminder: string
  ): string {
    const minutes = Math.floor(expiresIn / 60);
    // 使用无换行拼接法
    return [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '</head>',
      '<body style="margin:0;padding:0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;line-height:1.5;">',
      '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;margin:20px auto;background-color:#f6f6f6;">',
      '<tr>',
      '<td style="padding:30px 20px;background:#2c3e50;color:white;">',
      `<h1 style="margin:0;font-size:24px;"><b>${AppConstant.APP_NAME}</b></h1>`,
      '</td>',
      '</tr>',
      '<tr>',
      '<td style="padding:30px 20px;background:white;">',
      `<p style="margin:0 0 20px 0;color:#666;">尊敬的 <b>${AppConstant.APP_NAME}</b> 用户：您好！</p>`,
      `<p style="margin:0 0 15px 0;color:#444;">您正在进行 <span style="color:#e74c3c;"><b>${this.getBusinessTitle(type)}</b></span> 操作</p>`,
      `<div style="margin:25px 0;padding:20px;background:#f8f9fa;border-radius:4px;text-align:center;font-size:24px;letter-spacing:2px;color:#2c3e50;"><b>${code}</b></div>`,
      '<div style="color:#888;font-size:14px;line-height:1.6;">',
      `<p style="margin:10px 0;">⏳ 该验证码 <strong style="color:#e74c3c;">${minutes}</strong> 分钟内有效</p>`,
      `<p style="margin:10px 0;">⚠️ 注意：${reminder}</p>`,
      '<p style="margin:10px 0;">🔒 请勿将验证码透露给他人（包括客服人员）</p>',
      '</div>',
      '</td>',
      '</tr>',
      '<tr>',
      '<td style="padding:20px;text-align:center;color:#888;font-size:12px;">',
      '<p style="margin:5px 0;">此为系统邮件，请勿直接回复</p>',
      `<p style="margin:5px 0;">${AppConstant.APP_NAME} 安全团队</p>`,
      '</td>',
      '</tr>',
      '</table>',
      '</body>',
      '</html>'
    ].join(''); // 关键点：用数组拼接避免换行符
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
    businessType: string,
    once?: boolean
  ): boolean {
    const cacheKey = `${businessType}:${email}`;
    const storedCode = globalCache.get(cacheKey);
    // 没有对应的 key，返回 false
    if (!storedCode) {
      return false;
    }
    if (storedCode === code) {
      // 默认只能使用一次，使用完直接删除，防止重复使用
      if (once ?? true) {
        globalCache.del(cacheKey);
      }
      return true;
    }
    return false;
  }
}

export default EmailUtil;