/*
 * 用户相关业务逻辑
 * @Author: Franctoryer 
 * @Date: 2025-02-24 23:40:03 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-12 19:44:13
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
import AuthConstant from "@/constant/authConstant";
import EmailLoginDto from "@/dto/user/emailLoginDto";
import EmailLoginVo from "@/vo/user/emailLoginVo";
import EmailCodeDto from "@/dto/user/emailCodeDto";
import EmailCodeVo from "@/vo/user/emailCodeVo";
import EmailUtil from "@/util/emailUtil";
import EmailRegisterDto from "@/dto/user/emailRegisterDto";
import ForbiddenError from "@/exception/forbiddenError";
import crypto from "crypto"
import UnauthorizedError from "@/exception/unauthorizedError";
import ResetPasswordDto from "@/dto/user/resetPasswordDto";
import BindEmailDto from "@/dto/user/bindEmailDto";
import BindWxDto from "@/dto/user/bindWxDto";
import EmailLoginV2Dto from "@/dto/user/emailLoginV2Dto";
import ExpUtil from "@/util/expUtil";

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
      backgroundImageUrl: row.backgroundImageUrl,
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
   * 邮箱登录
   * @param emailLoginDto 
   * @returns 
   */
  static async emailLoginByPassword(emailLoginDto: EmailLoginDto): Promise<EmailLoginVo> {
    // 计算密码哈希
    const passwordHash = this.getPasswordHash(emailLoginDto.password);
    // 查数据库是否存在该用户
    const db = await dbPromise;
    const row = await db.get<{ uid: number; roleId: number }>(
      `
      SELECT uid, roleId FROM users
      WHERE email = ? AND password = ?
      `,
      [
        emailLoginDto.email,
        passwordHash
      ]
    )
    if (!row) {
      throw new UnauthorizedError("邮箱或密码错误！");
    }
    // 获取 uid 和 roleId，返回 token
    const { uid, roleId } = row;
    this.updateLastLoginTime(db, uid);  // 异步更新用户登录时间
    return new EmailLoginVo({
      token: JwtUtil.generateByUid(uid, roleId)
    });
  }

  /**
   * 通过验证码进行邮箱登录，如果没有该用户自动注册
   * @param email 
   * @param verifyCode 
   */
  static async emailLoginByCaptcha(email: string, verifyCode: string): Promise<EmailLoginVo> {
    // 校验验证码是否正确
    const isValid = EmailUtil.verifyCode(
      email,
      verifyCode,
      "login"
    );
    if (!isValid) {
      throw new ParamsError("验证码错误！");
    }
    // 在数据库查询该用户
    const db = await dbPromise;
    const row = await db.get<{ uid: number; roleId: number }>(
      `
      SELECT uid, roleId FROM users
      WHERE email = ?
      `,
      [email]
    );
    // 如果用户存在，返回 token
    if (row) {
      const { uid, roleId } = row;
      this.updateLastLoginTime(db, uid);  // 异步更新用户登录时间
      return new EmailLoginVo({
        token: JwtUtil.generateByUid(uid, roleId)
      })
    }
    // 如果不存在，则新建一个用户
    const passwordHash = this.getPasswordHash(UserConstant.DEFAULT_PASSWORD);
    const { uid, roleId } = await this.createUserByEmail(db, email, passwordHash);
    if (typeof uid === 'number') {
      this.init(db, uid); // 用户初始化操作
      return new EmailLoginVo({
        token: JwtUtil.generateByUid(uid, roleId)
      })
    } else {
      throw new Error("用户 ID 生成异常");
    }
  }

  /**
   * 邮箱登录（两种方式）
   * @param emailLoginV2Dto 
   */
  static async emailLogin(emailLoginV2Dto: EmailLoginV2Dto): Promise<EmailLoginVo> {
    const grantType = emailLoginV2Dto.grantType;
    if (grantType == "password") {
      // 密码登录
      if (!emailLoginV2Dto.password) {
        throw new ParamsError("密码不能为空");
      }
      return await this.emailLoginByPassword(new EmailLoginDto({
        email: emailLoginV2Dto.email,
        password: emailLoginV2Dto.password
      }))
    } else if (grantType == "captcha") {
      // 验证码登录
      if (!emailLoginV2Dto.verifyCode) {
        throw new ParamsError("验证码不能为空");
      }
      return await this.emailLoginByCaptcha(
        emailLoginV2Dto.email,
        emailLoginV2Dto.verifyCode
      );
    } else {
      throw new ParamsError("未知授权类型！");
    }
  }

  /**
   * 邮箱注册
   * @param emailRegisterDto 
   */
  static async emailRegister(emailRegisterDto: EmailRegisterDto): Promise<void> {
    // 先检查该邮箱是否已经注册
    const db = await dbPromise;
    const emailExists = await db.get<{_: number}>(
      `
      SELECT 1 FROM users
      WHERE email = ?
      `,
      [emailRegisterDto.email]
    );
    if (emailExists) {
      throw new ForbiddenError("该邮箱已经注册过了！")
    }
    // 检验验证码是否有效
    const isValid = EmailUtil.verifyCode(
      emailRegisterDto.email,
      emailRegisterDto.verifyCode,
      "register"
    );
    if (!isValid) {
      throw new ForbiddenError("验证码错误");
    }
    // 注册新用户
    // 计算密码哈希，加盐防止彩虹表爆破
    const passwordHash = this.getPasswordHash(emailRegisterDto.password);
    await this.createUserByEmail(
      db,
      emailRegisterDto.email,
      passwordHash
    )
  }

  /**
   * 重置用户密码
   * @param resetPasswordDto 
   */
  static async emailResetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    // 先检查该邮箱是否存在
    const db = await dbPromise;
    const emailExists = await db.get<{_: number}>(
      `
      SELECT 1 FROM users
      WHERE email = ?
      `,
      [resetPasswordDto.email]
    );
    if (!emailExists) {
      throw new ForbiddenError("该邮箱不存在！")
    }
    // 检查验证码是否有效
    const isValid = EmailUtil.verifyCode(
      resetPasswordDto.email,
      resetPasswordDto.verifyCode,
      "reset"
    );
    if (!isValid) {
      throw new ForbiddenError("验证码错误");
    }
    // 更新用户密码
    // 计算新密码的哈希
    const passwordHash = this.getPasswordHash(
      resetPasswordDto.password
    );
    await db.run(
      `
      UPDATE users SET password = ?
      WHERE email = ?
      `,
      [
        passwordHash,
        resetPasswordDto.email
      ]
    )
  }

  /**
   * 向某个邮箱发送验证码，并把验证码和验证码 ID 返回给用户
   * @param emailCodevoidvoid
   */
  static async sendVerifyCode(emailCodeDto: EmailCodeDto): Promise<void> {
    let reminder = ""
    switch (emailCodeDto.businessType) {
      case "login":
        reminder = "您正在尝试邮箱登录，若该邮箱未注册，验证通过后将自动创建账户（初始密码为<b>123456</b>）";
        break;
      case "register":
        reminder = "您正在进行账户注册操作，请保管您的密码，请勿泄露给他人";
        break;
      case "reset":
        reminder = "重置密码后，请保管您的密码，请勿泄露给他人";
        break;
      case "bind":
        reminder = "每个邮箱仅支持绑定一个主账号，<b>若已有该邮箱账号：如果该账号与微信号绑定，将自动解绑；如果该账号无微信号绑定，将自动注销，请谨慎操作！</b>";
        break;
      default:
        reminder = "此操作可能会修改您的账户重要信息。如非本人操作，请立即登录修改密码"
    }

    // 发送验证码，6 位数字，5 分钟过期
    await EmailUtil.sendVerifyCode(
      emailCodeDto.email,
      {
        businessType: emailCodeDto.businessType,
        reminder: reminder
      }
    )
  }

  /**
   * 微信用户绑定邮箱
   * @param uid 用户 ID
   * @param bindEmailDto 绑定邮箱传参
   */
  static async bindEmail(uid: number, bindEmailDto: BindEmailDto): Promise<void> {
    const db = await dbPromise;
    // 先校验验证码是否有效
    const isValid = EmailUtil.verifyCode(
      bindEmailDto.email,
      bindEmailDto.verifyCode,
      "bind"
    );
    if (!isValid) {
      throw new ParamsError("验证码错误！")
    }
    
    if (bindEmailDto.force) {
      // 强制绑定模式：也只能绑定没有绑定微信的邮箱账号
      await db.run('BEGIN TRANSACTION');
      try {
        // 1. 清空其他用户对该邮箱的绑定
        await db.run(
          `UPDATE users SET email = NULL 
          WHERE email = ? AND uid <> ?`,
          [bindEmailDto.email, uid]
        );
        
        // 2. 更新当前用户邮箱
        await db.run(
          `UPDATE users SET email = ? 
          WHERE uid = ?`,
          [bindEmailDto.email, uid]
        );
        
        await db.run('COMMIT');
      } catch (error) {
        await db.run('ROLLBACK');
        throw error;
      }
    } else {
      // 非强制模式：单次条件更新查询
      const result = await db.run(
        `UPDATE users SET email = ?
        WHERE uid = ? 
          AND NOT EXISTS (
            SELECT 1 FROM users 
            WHERE email = ? AND uid <> ?
          )`,
        [bindEmailDto.email, uid, bindEmailDto.email, uid]
      );

      // 通过影响行数判断是否冲突
      if (result.changes === 0) {
        throw new ParamsError('邮箱已被其他用户绑定');
      }
    }
  }

  /**
   * 邮箱用户绑定微信
   * @param uid 用户 ID
   * @param bindWxDto 绑定微信参数
   */
  static async bindWx(uid: number, bindWxDto: BindWxDto): Promise<void> {
    // 获取微信 openid
    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const params = {
      appid: AppConstant.APP_ID,
      secret: AppConstant.APP_SECRET,
      js_code: bindWxDto.code,
      grant_type: 'authorization_code',
    };
    const res = await axios.get(url, { params });

    // 检查微信接口响应状态
    if (res.status != StatusCodes.OK) throw new WxServiceError();
    const resJson = res.data;

    // 处理微信接口错误码
    if (resJson.errcode && resJson.errcode !== 0) {
      switch (resJson.errcode) {
        case 40029:
          throw new ParamsError("授权码无效");
        case 40163:
          throw new ParamsError("登录凭证重复使用");
        default:
          throw new WxServiceError();
      }
    }

    const db = await dbPromise;
    const openid: string = resJson.openid;

    if (bindWxDto.force) {
      // 强制绑定模式：使用事务确保原子性操作
      await db.run('BEGIN TRANSACTION');
      try {
        // 1. 解除其他用户的微信绑定
        await db.run(
          `UPDATE users SET wx_openid = NULL 
           WHERE wx_openid = ? AND uid <> ?`,
          [openid, uid]
        );
        
        // 2. 更新当前用户微信绑定
        await db.run(
          `UPDATE users SET wx_openid = ? 
           WHERE uid = ?`,
          [openid, uid]
        );
        
        await db.run('COMMIT');
      } catch (error) {
        await db.run('ROLLBACK');
        throw error;
      }
    } else {
      // 非强制模式：单次条件更新查询
      const result = await db.run(
        `UPDATE users SET wx_openid = ?
         WHERE uid = ? 
           AND NOT EXISTS (
             SELECT 1 FROM users 
             WHERE wx_openid = ? AND uid <> ?
           )`,
        [openid, uid, openid, uid]
      );

      // 通过影响行数判断是否冲突
      if (result.changes === 0) {
        throw new ParamsError('微信账号已被其他用户绑定');
      }
    }
  }

  /**
   * 更新用户的基本信息
   * @param userInfoDto 用户基本信息（除了昵称、头像、背景图片）
   */
  static async updateUserInfo(userInfoDto: UserInfoDto, uid: number): Promise<void> {
    const db = await dbPromise;
    await db.run(
      `UPDATE users
      SET gender = ?, phone = ?,
      signature = ?, birthday = ?, updatedAt = ?
      WHERE uid = ?
      `,
      [
        userInfoDto.gender,
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
    // 如果是默认头像，则不删除
    if (typeof oldAvatarUrl !== 'undefined' && 
      CosUtil.isValidCosUrl(oldAvatarUrl) &&
      !oldAvatarUrl.includes("default")
    ) {
      CosUtil.deleteFile(oldAvatarUrl)
    }
    // 返回新头像 url
    return freshAvatarUrl;
  }

  /**
   * 更换用户背景图片，返回新图片的 url
   * @param base64 图片的 base64 编码
   */
  static async updateBackgroundImage(base64: string, uid: number): Promise<string> {
    // 上传新图片
    const freshBackgroundImageUrl = await CosUtil.uploadBase64Picture(CosConstant.BACKGROUND_IMAGES_FOLDER, base64);
    // 获取旧的图片地址
    const db = await dbPromise;
    const row = await db.get<Pick<User, 'backgroundImageUrl'>>(
      'SELECT backgroundImageUrl FROM users WHERE uid = ?',
      [uid]
    );
    if (!row) throw new NotFoundError(`用户 ${uid} 不存在`);
    const oldBackgroundImageUrl = row.backgroundImageUrl;
    // 更新数据库中的图片 url
    await db.run(
      'UPDATE users SET backgroundImageUrl = ? WHERE uid = ?',
      [freshBackgroundImageUrl, uid]
    )
    // 异步删除 COS 上原来的图片，不影响主线程（没有await），较少IO时长（当旧图片地址不为空，且是合法的图片路径）
    // 如果是默认图片，则不删除
    if (typeof oldBackgroundImageUrl !== 'undefined' && 
      CosUtil.isValidCosUrl(oldBackgroundImageUrl) &&
      !oldBackgroundImageUrl.includes("default")
    ) {
      CosUtil.deleteFile(oldBackgroundImageUrl)
    }
    // 返回新图片 url
    return freshBackgroundImageUrl;
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
    // 更新角色类型
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
    // 更新经验值
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
    // 放入更新队列
    AuthConstant.UPDATE_UID_LIST.add(uid);
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
        nickname, wxOpenid, gender, avatarUrl, backgroundImageUrl, roleId,
        status, exp, lastLoginAt, createdAt, updatedAt
      ) VALUES (
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
       )`,
      [
        defaultNickname,
        openid,
        UserConstant.CONFIDENTIAL,
        UserUtil.generateDefaultAvatarUrl(),
        UserUtil.generateDefaultBackgroundImageUrl(),
        UserConstant.DEFAULT_ROLE,
        UserConstant.STATUS_ENABLE,
        0,
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
   * 通过邮箱创建新用户
   * @param db 数据库对象
   * @param email 邮箱
   * @param passwordHash 密码哈希
   */
  private static async createUserByEmail(
    db: Database, 
    email: string,
    passwordHash: string
  ): Promise<{ uid: number; roleId: number }> {
    const defaultNickname = `用户_${Math.random().toString(36).substr(2, 5)}`;

    // 插入新用户，并返回新的用户 id
    const { lastID } = await db.run(
      `INSERT INTO users (
        nickname, email, password, gender, 
        avatarUrl, backgroundImageUrl, roleId, exp,
        status, lastLoginAt, createdAt, updatedAt
      ) VALUES (
       ?, ?, ?, ?, 
       ?, ?, ?, ?,
       ?, ?, ?, ?
       )`,
      [
        defaultNickname,
        email,
        passwordHash,
        UserConstant.CONFIDENTIAL,
        UserUtil.generateDefaultAvatarUrl(),
        UserUtil.generateDefaultBackgroundImageUrl(),
        UserConstant.DEFAULT_ROLE,
        0,
        UserConstant.STATUS_ENABLE,
        Date.now(),
        Date.now(),
        Date.now()
      ]
    );

    if (!lastID) throw new Error('用户创建失败');

    // 新用户自动加入世界频道
    ChannelService.join(lastID, ChannelConstant.WORLD_CHANNEL_ID);
    return {
      uid: lastID,  // 用户 ID
      roleId: UserConstant.DEFAULT_ROLE  // 角色 ID
    }
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

    // 改成异步更新
    if (!isSameDay) {
      if (isContinuousLogin) {
        ExpUtil.add(uid, UserConstant.CONTINUOUS_LOGIN_EXP);
      }
      else {
        ExpUtil.add(uid, UserConstant.DEFAULT_LOGIN_EXP);
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

  /**
   * 获取密码的哈希值，使用 sha1 哈希再加盐的方式
   * @param password 密码
   */
  private static getPasswordHash(password: string): string {
    return crypto.createHash("sha1")
    .update(password + AuthConstant.SALT)
    .digest("hex");
  }
}

export default UserService;