/*
 * 用户相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:40:03 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-23 19:32:51
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
import ChannelService from "./channelService";
import ChannelConstant from "@/constant/channelConstant";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import RoleDto from "@/dto/user/roleDto";
import RoleUtil from "@/util/roleUtil";
import RoleConstant from "@/constant/RoleConstant";

class UserService {
  static async getUserDetailByUid(uid: number) {
    const db = await dbPromise;
    const row = await db.get<Partial<User>>(
      `SELECT 
      uid, nickname, gender, avatarUrl, email,
      phone, signature, birthday, exp, roleId
      FROM users WHERE uid = ?`,
      [uid]
    );
    if (!row) throw new NotFoundError("该用户不存在");
    return new UserDetailVo({
      uid: row.uid,
      nickname: row.nickname,
      gender: UserUtil.getGenderStr(row.gender),
      avatarUrl: row.avatarUrl,
      email: row.email,
      phone: row.phone,
      signature: row.signature,
      birthday: row.birthday,
      exp: row.exp,
      role: RoleUtil.roleNumberToString(row.roleId as number)
    })
  }

  /**
   * 微信登录
   * @param wxLoginDto 微信登录需要的参数（授权码）
   * @returns token
   */
  static async wxLogin(wxLoginDto: WxLoginDto): Promise<WxLoginVo> {
    // 调用微信接口，获取用户的 openid（改成 axios）
    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const params = {
      appid: AppConstant.APP_ID,
      secret: AppConstant.APP_SECRET,
      js_code: wxLoginDto.code,
      grant_type: 'authorization_code',
    };
    const res = await axios.get(url, { params })

    // 先检查状态码是否正常
    if (res.status != StatusCodes.OK) throw new WxServiceError();
    const resJson = await res.data;

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
    let user = await this.findUserByOpenid(db, openid);

    // 如果存在，根据 uid 返回 token
    if (typeof user !== 'undefined') {
      const { uid, roleId } = user;
      this.updateLastLoginTime(db, uid);  // 异步更新用户登录时间
      return new WxLoginVo({
        openid: openid,
        token: JwtUtil.generateByUid(uid, roleId)
      });
    }

    // 如果不存在，新增一个用户，返回 token
    const { uid, roleId } = await this.createUser(db, openid);
    if (typeof uid === 'number') {
      this.init(db, uid); // 用户初始化操作
      return new WxLoginVo({
        openid: openid,
        token: JwtUtil.generateByUid(uid, roleId)
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
      signature = ?, birthday = ?, updatedAt = ?
      WHERE uid = ?
      `,
      [
        userInfoDto.gender,
        userInfoDto.email,
        userInfoDto.phone,
        userInfoDto.signature,
        userInfoDto.birthday,
        Date.now(),
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
   * @param base64 头像的 base64 编码
   */
  static async updateAvatar(base64: string, uid: number): Promise<string> {
    // 上传新头像
    const freshAvatarUrl = await CosUtil.uploadBase64Picture(CosConstant.AVATAR_FOLDER, base64);
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
    await db.run(
      `DELETE FROM users WHERE uid = ?`,
      [uid]
    )
  }

  /**
   * 将自身等级提升到对应的角色类型
   * @param uid 用户 ID
   * @param role 角色类型
   */
  static async getPrivilege(uid: number, roleDto: RoleDto): Promise<void> {
    const roleId = RoleUtil.roleStringToNumber(roleDto.role);
    // 更新用户表对应用户的 roleId 字段
    const db = await dbPromise;
    const getExp = (roleId: number): number => {
      switch (roleId) {
        case RoleConstant.PASSENGER:
          return 0;
        case RoleConstant.SAILOR:
          return 20;
        case RoleConstant.BOATSWAIN:
          return 150;
        case RoleConstant.CHIEF_ENGINEER:
          return 450;
        case RoleConstant.FIRST_MATE:
          return 1080;
        case RoleConstant.CAPTAIN:
          return 2880;
        case RoleConstant.EXPLORER:
          return 10000;
        case RoleConstant.ADMIN:
          return 0;
        default:
          throw new ParamsError("角色类型错误");
      }
    }
    await db.run(
      `
      UPDATE users SET roleId = ?
      WHERE uid = ?
      `,
      [
        roleId,
        uid
      ]
    )
    await db.run(
      `
      UPDATE users SET exp = ?
      WHERE uid = ?
      `,
      [
        getExp(roleId),
        uid
      ]
    )
  }

  /**
   * 根据 openid 查询用户 id
   * @param db 数据库对象
   * @param openid 微信 openid
   * @returns 用户id
   */
  private static async findUserByOpenid(db: Database, openid: string): Promise<{ uid: number, roleId: number } | undefined> {
    const row = await db.get<Pick<User, 'uid' | 'roleId'>>(
      "SELECT uid, roleId FROM users WHERE wxOpenid = ?",
      [openid]
    );
    if (!row) {
      return undefined;
    }
    return {
      uid: row.uid,
      roleId: row.roleId
    };
  }

  /**
   * 创建新用户
   * @param db 数据库对象
   * @param openid 微信 openid
   * @returns 新建用户的 uid 和 roleId
   */
  private static async createUser(db: Database, openid: string): Promise<{ uid: number; roleId: number }> {
    const defaultNickname = `微信用户_${Math.random().toString(36).substr(2, 5)}`;

    // 插入新用户，并返回新的用户 id
    const { lastID } = await db.run(
      `INSERT INTO users (
        nickname, wxOpenid, gender, avatarUrl, roleId,
        status, lastLoginAt, createdAt, updatedAt
      ) VALUES (
       ?, ?, ?, ?, ?, ?, ?, ?, ?
       )`,
      [
        defaultNickname,
        openid,
        UserConstant.CONFIDENTIAL,
        UserUtil.generateDefaultAvatarUrl(),
        UserConstant.DEFAULT_ROLE,
        UserConstant.STATUS_ENABLE,
        Date.now(),
        Date.now(),
        Date.now()
      ]
    );

    if (!lastID) throw new Error('用户创建失败');

    // 新用户自动加入世界频道
    ChannelService.join(lastID, ChannelConstant.WORLD_CHANNEL_ID);
    // 返回 uid 和 roleId 用于生成 jwt
    return {
      uid: lastID,  // 用户 ID
      roleId: UserConstant.DEFAULT_ROLE  // 角色 ID
    };
  }

  /**
   * 更新用户的登录时间
   * @param db 数据库对象
   * @param uid 用户 ID
   */
  private static async updateLastLoginTime(db: Database, uid: number): Promise<void> {
    // 检查上一次登录的时间,如果时间在昨天,则用户经验+8,在更早,则经验+5,在今天,经验不变
    const row = await db.get<{ lastLoginAt: number }>(
      `SELECT lastLoginAt FROM users WHERE uid = ?`,
      [uid]
    );
    if (!row) throw new NotFoundError("该用户不存在");
    const lastLoginAt = row.lastLoginAt;
    const now = Date.now();
    const lastLoginStr = new Date(lastLoginAt).toLocaleDateString("zh-CN", { timeZone: 'Asia/Shanghai' });
    const nowStr = new Date(now).toLocaleDateString("zh-CN", { timeZone: 'Asia/Shanghai' });
    const isSameDay = lastLoginStr === nowStr;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("zh-CN", { timeZone: 'Asia/Shanghai' });
    const isContinuousLogin = lastLoginStr === yesterdayStr;

    if (!isSameDay) {
      if (isContinuousLogin) {
        await db.run(
          `UPDATE users SET exp = exp + ? WHERE uid = ?`,
          [
            UserConstant.CONTINUOUS_LOGIN_EXP,
            uid
          ]
        )
      }
      else {
        await db.run(
          `UPDATE users SET exp = exp + ? WHERE uid = ?`,
          [
            UserConstant.DEFAULT_LOGIN_EXP,
            uid
          ]
        )
      }
    }

    await db.run(
      `UPDATE users SET lastLoginAt = ? WHERE uid = ?`,
      [
        Date.now(),
        uid
      ]
    )
  }

  /**
   * 创建用户后的一些初始化操作（异步初始化）
   * @param db 数据库对象
   * @param uid 用户 ID
   */
  private static async init(db: Database, uid: number): Promise<void> {
    this.updateLastLoginTime(db, uid);  // 更新登录时间
    ChannelService.join(uid, ChannelConstant.WORLD_CHANNEL_ID)  // 加入世界频道
  }
}

export default UserService;