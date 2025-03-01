/*
 * 用户相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:40:03 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-01 21:35:54
 */
import UserDetailVo from "@/vo/userDetailVo";
import User from "@/entity/user";
import { UserUtil } from "@/util/userUtil";
import WxLoginDto from "@/dto/wxLoginDto";
import UnauthorizedError from "@/exception/unauthorizedError";
import AppConstant from "@/constant/appConstant";
import JwtUtil from "@/util/jwtUtil";
import dbPromise from "@/config/databaseConfig";
import UserConstant from "@/constant/userConstant";
import { Database } from "sqlite";
import WxLoginVo from "@/vo/wxLoginVo";

class UserService {
  static async getUserDetailByUid(uid: number) {
    const db = await dbPromise;
    const row = await db.get<Partial<User>>(
      "SELECT uid, nickname, school, avatarUrl, gender FROM users WHERE uid = ?", 
      [uid]
    );
    if (!row) return null;
    return new UserDetailVo({
      uid: row.uid,
      name: row.nickname,
      school: row.school,
      avatarUrl: row.avatarUrl,
      gender: UserUtil.getGenderStr(row.gender)
    })
  }

  /**
   * 微信登录
   * @param wxLoginDto 微信登录需要的参数（授权码）
   * @returns token
   */
  static async wxLogin(wxLoginDto: WxLoginDto): Promise<WxLoginVo> {
    // 调用微信接口，获取用户的 openid
    const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
    url.searchParams.append('appid', AppConstant.APP_ID);
    url.searchParams.append('secret', AppConstant.APP_SECRET);
    url.searchParams.append('js_code', wxLoginDto.code);
    url.searchParams.append('grant_type', 'authorization_code');
    const res = await fetch(url.toString());
    
    // 先检查状态码是否正常
    if (!res.ok) throw new Error(`微信接口响应异常: ${res.status}`);
    const resJson = await res.json();

    // 如果错误码不是 0，抛出认证异常
    if (resJson.errcode && resJson.errcode !== 0) {
      throw new UnauthorizedError();
    }

    // 如果正常响应，获取 openid
    const openid: string = resJson.openid;
    
    // 查询数据库中是否已经存在该用户
    const db = await dbPromise;
    let uid = await this.findUserByOpenid(db, openid);

    // 如果存在，根据 uid 返回 token
    if (typeof uid !== 'undefined') {
      return new WxLoginVo({
        openid: openid,
        token: JwtUtil.generateByUid(uid)
      })
    }

    // 如果不存在，新增一个用户，返回 token
    uid = await this.createUser(db, openid);
    if (typeof uid === 'number') {
      return new WxLoginVo({
        openid: openid,
        token: JwtUtil.generateByUid(uid)
      })
    } else {
      throw new Error("用户 ID 生成异常");
    }
  }

  /**
   * 根据 openid 查询用户 id
   * @param db 数据库对象
   * @param openid 微信 openid
   * @returns 用户id
   */
  private static async findUserByOpenid(db: Database, openid: string): Promise<number | undefined> {
    return db.get<number>(
      "SELECT uid FROM users WHERE wxOpenid = ?",
      [openid]
    )
  }

  /**
   * 创建新用户
   * @param db 数据库对象
   * @param openid 微信 openid
   * @returns 新建用户的用户 id
   */
  private static async createUser(db: Database, openid: string): Promise<number> {
    const defaultNickname = `微信用户_${Math.random().toString(36).substr(2, 6)}`;
    
    // 插入新用户，并返回新的用户 id
    const { lastID } = await db.run(
      `INSERT INTO users (
        nickname, wxOpenid, gender, avatarUrl, 
        rank, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        defaultNickname,
        openid,
        UserConstant.CONFIDENTIAL,
        UserConstant.DEFAULT_AVATAR_URL,
        UserConstant.DEFAULT_RANK,
        UserConstant.STATUS_ENABLE
      ]
    );

    if (!lastID) throw new Error('用户创建失败');
    return lastID;
  }
}

export default UserService;