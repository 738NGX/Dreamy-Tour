import VO from "@/base/vo";

class AuthorityVo extends VO<AuthorityVo> {
  isAdmin: boolean; // 是否是管理员
  isOwner: boolean; // 是否是拥有者
}

export default AuthorityVo;