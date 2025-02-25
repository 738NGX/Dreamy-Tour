/*
 * 用户相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:40:03 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 18:33:44
 */
import db from "@/config/databaseConfig";
import UserDetailVo from "@/vo/userDetailVo";
import User from "@/entity/user";
import { UserUtil } from "@/util/userUtil";

class UserService {
  static async getUserDetailByUid(uid: number) {
    const row = await db.get<Partial<User>>("SELECT * FROM users WHERE uid = ?", [uid]);
    if (!row) return null;
    return new UserDetailVo({
      uid: row.uid,
      name: row.nickname,
      school: row.school,
      avatarUrl: row.avatarUrl,
      gender: UserUtil.getGenderStr(row.gender)
    })
  }
}

export default UserService;