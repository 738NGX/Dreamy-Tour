import VO from "@/base/vo";

class EmailLoginVo extends VO<EmailLoginVo> {
  // 身份令牌，放入 Authorization 字段
  token: string
}

export default EmailLoginVo;