/*
 * 用户详情展示的数据
 * @Author: Franctoryer 
 * @Date: 2025-02-24 08:00:11 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-02-25 18:40:34
 */

import VO from "@/base/vo"


/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetailVo:
 *       type: object
 *       required:
 *         - uid
 *         - name
 *         - age
 *         - school
 *         - avatar_url
 *       properties:
 *         uid:
 *           type: integer
 *           description: 用户唯一标识符 (UID)
 *           example: 12
 *         name:
 *           type: string
 *           description: 用户姓名
 *           example: zlt
 *         age:
 *           type: integer
 *           description: 用户年龄
 *           example: 22
 *         school:
 *           type: string
 *           description: 用户所属学校名称
 *           example: sufe
 *         avatar_url:
 *           type: string
 *           format: uri
 *           description: 用户头像的 URL 地址
 *           example: https://your.avatar.com
 *         gender:
 *           type: string
 *           description: 性别（女、男、保密）
 *           example: 保密
 */
class UserDetailVo extends VO<UserDetailVo> {
  // 用户 id
  uid: number

  // 姓名
  name: string

  // 年龄
  age: number

  // 学校名称
  school: string

  // 头像地址
  avatarUrl: string

  // 性别
  gender: string
}

export default UserDetailVo