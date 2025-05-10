import rabbitMQConfig from "@/config/rabbitMqConfig";
import RabbitMQConsumer from "../consumer";
import { Channel, ConsumeMessage } from "amqplib";
import { logger } from "@/config/loggerConfig";
import EmailCodeDto from "@/dto/user/emailCodeDto";
import EmailUtil from "@/util/emailUtil";

class EmailConsumer extends RabbitMQConsumer {
  constructor() {
    super(rabbitMQConfig.queues.emailCaptcha);
  }

  protected async handleMessage(channel: Channel, msg: ConsumeMessage | null): Promise<void> {
    if (!msg) {
      logger.warn('Received null message');
      return;
    }

    try {
      const emailCodeDto = JSON.parse(msg.content.toString()) as EmailCodeDto;
      let reminder = ""
      switch (emailCodeDto.businessType) {
        case "login":
          reminder = "您正在尝试邮箱登录，若该邮箱未注册，验证通过后将自动创建账户（初始密码为<b>123456</b>）";
          break;
        case "register":
          reminder = "您正在进行账户注册操作，请保管您的密码，请勿泄露给他人";
          break;
        case "reset":
          reminder = "重置密码后，请保管您的密码，请勿泄露给他人";
          break;
        case "bind":
          reminder = "每个邮箱仅支持绑定一个主账号，<b>若已有该邮箱账号：如果该账号与微信号绑定，将自动解绑；如果该账号无微信号绑定，将自动注销，请谨慎操作！</b>";
          break;
        default:
          reminder = "此操作可能会修改您的账户重要信息。如非本人操作，请立即登录修改密码"
      }
      // 发送验证码，6 位数字，5 分钟过期
      await EmailUtil.sendVerifyCode(
        emailCodeDto.email,
        {
          businessType: emailCodeDto.businessType,
          reminder: reminder
        }
      )
    } catch(err: any) {
      logger.error(`Failed to consume msg in ${rabbitMQConfig.queues.emailCaptcha}: ${err}`)
    }
  }
}

export default EmailConsumer;