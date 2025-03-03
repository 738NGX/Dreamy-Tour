/*
 * 用户相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:40:03 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-03 10:09:35
 */
import UserDetailVo from "@/vo/user/userDetailVo";
import User from "@/entity/user";
import { UserUtil } from "@/util/userUtil";
import WxLoginDto from "@/dto/user/wxLoginDto";
import AppConstant from "@/constant/appConstant";
import JwtUtil from "@/util/jwtUtil";
import dbPromise from "@/config/databaseConfig";
import UserConstant from "@/constant/userConstant";
import { Database } from "sqlite";
import WxLoginVo from "@/vo/user/wxLoginVo";
import UserInfoDto from "@/dto/user/userInfoDto";
import NicknameDto from "@/dto/user/nicknameDto";
import { Readable } from "stream";
import CosUtil from "@/util/cosUtil";
import CosConstant from "@/constant/cosConstant";
import WxServiceError from "@/exception/wxServiceError";
import ParamsError from "@/exception/paramsError";
import NotFoundError from "@/exception/notFoundError";

class UserService {
  static async getUserDetailByUid(uid: number) {
    const db = await dbPromise;
    const row = await db.get<Partial<User>>(
      `SELECT 
      uid, nickname, gender, avatarUrl, email,
      phone, signature, birthday, rank
      FROM users WHERE uid = ?`, 
      [uid]
    );
    if (!row) return null;
    return new UserDetailVo({
      uid: row.uid,
      nickname: row.nickname,
      gender: UserUtil.getGenderStr(row.gender),
      avatarUrl: row.avatarUrl,
      email: row.email,
      phone: row.phone,
      signature: row.signature,
      birthday: row.birthday,
      rank: row.rank
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
    if (!res.ok) throw new WxServiceError();
    const resJson = await res.json();
    
    // 获取错误码，如果错误码不是 0，抛出异常
    const errcode = resJson.errcode;
    if (errcode && errcode !== 0) {
      switch (errcode) {
        case 40029:
          throw new ParamsError("授权码无效");
        case 40163:
          throw new ParamsError("登录凭证重复使用")
        default:
          throw new WxServiceError();
      }
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
   * 更新用户的基本信息
   * @param userInfoDto 用户基本信息（除了昵称、头像）
   */
  static async updateUserInfo(userInfoDto: UserInfoDto, uid: number): Promise<void> {
    const db = await dbPromise;
    await db.run(
      `UPDATE users
      SET gender = ?, email = ?, phone = ?,
      signature = ?, birthday = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE uid = ?
      `,
      [
        userInfoDto.gender,
        userInfoDto.email,
        userInfoDto.phone,
        userInfoDto.signature,
        userInfoDto.birthday,
        uid
      ]
    );
  }

  /**
   * 修改用户昵称
   * @param nicknameDto 新昵称
   */
  static async updateNickname(nicknameDto: NicknameDto, uid: number): Promise<void> {
    const db = await dbPromise;
    await db.run(
      `UPDATE users
      SET nickname = ?
      WHERE uid = ?`, 
      [
        nicknameDto.nickname,
        uid
      ]
    );
  }

  /**
   * 更换用户头像，返回新头像的 url
   * TODO: 开启事务
   * @param file 文件
   */
  static async updateAvatar(file: Buffer | Readable, uid: number, fileExtension?: string): Promise<string> {
    // 上传新头像
    const freshAvatarUrl = await CosUtil.uploadFile(CosConstant.AVATAR_FOLDER, file, fileExtension);
    // 获取旧的头像地址
    const db = await dbPromise;
    const row = await db.get<Pick<User, 'avatarUrl'>>(
      'SELECT avatarUrl FROM users WHERE uid = ?',
      [uid]
    );
    if (!row) throw new NotFoundError(`用户 ${uid} 不存在`);
    const oldAvatarUrl = row.avatarUrl;
    // 更新数据库中的头像 url
    await db.run(
      'UPDATE users SET avatarUrl = ? WHERE uid = ?',
      [freshAvatarUrl, uid]
    )
    // 异步删除 COS 上原来的头像，不影响主线程（没有await），较少IO时长（当旧头像地址不为空，且是合法的图片路径）
    if (typeof oldAvatarUrl !== 'undefined' && CosUtil.isValidCosUrl(oldAvatarUrl)) {
      CosUtil.deleteFile(oldAvatarUrl)
    }
    // 返回新头像 url
    return freshAvatarUrl;
  }

  /**
   * 账号注销
   * @param uid 用户 id
   */
  static async unRegister(uid: number): Promise<void> {
    const db = await dbPromise;
    db.run(
      `DELETE FROM users WHERE uid = ?`, 
      [uid]
    )
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
        nickname, wxOpenid, gender, avatarUrl, rank,
        status, lastLoginAt, createdAt, updatedAt
      ) VALUES (
       ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
       )`,
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