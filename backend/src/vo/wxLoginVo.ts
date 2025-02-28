import VO from "@/base/vo";
import { Expose } from "class-transformer";

class WxLoginVo extends VO<WxLoginVo> {
  @Expose()
  token: string // jwt，放入 Authorization 字段
}

export default WxLoginVo;