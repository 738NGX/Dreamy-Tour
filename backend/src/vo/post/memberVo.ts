import VO from "@/base/vo";

class MemberVo extends VO<MemberVo> {
   // 用户 ID
   uid: number

   // 用户名
   nickname: string
 
   // 性别（0 女 / 1 男 / 2 保密）
   gender: string
 
   // 头像地址
   avatarUrl: string
 
   // 邮箱
   email: string
 
   // 手机号
   phone: string
 
   // 个性签名
   signature: string
 
   // 生日
   birthday: string
 
   // 经验值
   exp: number
 
   // 角色类型
   role: string
 
   // 创建时间
   createdAt: number
 
   // 更新时间
   updatedAt: number
}

export default MemberVo