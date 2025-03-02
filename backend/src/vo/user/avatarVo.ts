/*
 * 更新用户头像返回的数据
 * @Author: Franctoryer 
 * @Date: 2025-03-02 20:27:52 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-02 20:28:12
 */
import VO from "@/base/vo";

class AvatarVo extends VO<AvatarVo>{
  // 新的头像地址
  avatarUrl: string
}

export default AvatarVo;