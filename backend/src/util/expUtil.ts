import dbPromise from "@/config/databaseConfig";
import AuthConstant from "@/constant/authConstant";

/*
 * 经验值相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-04-12 16:34:59 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-12 20:39:36
 */
class ExpUtil {
  static async add(uid: number, exp: number) {
    const db = await dbPromise;
    // 获取原来的 roleId
    const previous = await db.get<{ roleId: number }>(
      `
      SELECT roleId FROM users
      WHERE uid = ?
      `,
      [uid]
    )
    // 异步更新经验值
    await db.get<{ roleId: number }>(
      `
      UPDATE users SET exp = exp + ?
      WHERE uid = ?
      RETURNING roleId
      `,
      [
        exp,
        uid
      ]
    );
    // 获取原来的 roleId
    const after = await db.get<{ roleId: number }>(
    `
    SELECT roleId FROM users
    WHERE uid = ?
    `,
    [uid]
    )
    // 如果 roleId 发生变化，将其放入更新队列
    if (after?.roleId !== previous?.roleId) {
      AuthConstant.UPDATE_UID_LIST.add(uid);
    }
  }

  static async minus(uid: number,  exp: number) {
    const db = await dbPromise;
    // 获取原来的 roleId
    const previous = await db.get<{ roleId: number }>(
      `
      SELECT roleId FROM users
      WHERE uid = ?
      `,
      [uid]
    )
    // 异步更新经验值
    await db.get<{ roleId: number }>(
      `
      UPDATE users SET exp = exp - ?
      WHERE uid = ?
      RETURNING roleId
      `,
      [
        exp,
        uid
      ]
    );
    // 获取原来的 roleId
    const after = await db.get<{ roleId: number }>(
    `
    SELECT roleId FROM users
    WHERE uid = ?
    `,
    [uid]
    )
    // 如果 roleId 发生变化，将其放入更新队列
    if (after?.roleId !== previous?.roleId) {
      AuthConstant.UPDATE_UID_LIST.add(uid);
    }
  }
}

export default ExpUtil;