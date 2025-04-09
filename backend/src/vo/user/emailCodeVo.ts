import VO from "@/base/vo";

class EmailCodeVo extends VO<EmailCodeVo> {
  // 验证码 ID
  codeId: string
  // 验证码
  captcha: string
}

export default EmailCodeVo;