import dbPromise from "@/config/databaseConfig";
import GroupDto from "@/dto/group/groupDto";
import TourUtil from "@/util/tourUtil";
import CurrencyService from "./currencyService";
import ExchangeRateDto from "@/dto/currency/exchangeRateDto";
import ParamsError from "@/exception/paramsError";
import TourBasicVo from "@/vo/tour/tourBasicVo";
import TourVo from "@/vo/tour/tourVo";
import Tour from "@/entity/tour";
import TourDto from "@/dto/tour/tourDto";
import TourBasicDto from "@/dto/tour/tourBasicDto";
import UserDetailVo from "@/vo/user/userDetailVo";
import User from "@/entity/user";
import { UserUtil } from "@/util/userUtil";
import RoleUtil from "@/util/roleUtil";

class TourService {
  /**
   * 
   * @param groupId 
   * @param groupDto 
   * @param uid 
   */
  static async createTour(groupId: number, groupDto: GroupDto, uid: number): Promise<void> {
    const tourTemplateId = groupDto.tourTemplateId;
    const tourName = groupDto.name;
    const linkedChannel = groupDto.linkedChannel;
    const linkedGroup = groupId;
    const mainCurrency = TourUtil.convertCurrencyStringToNumber(groupDto.mainCurrency);
    const subCurrency = TourUtil.convertCurrencyStringToNumber(groupDto.subCurrency);
    const currencyExchangeRate = (await CurrencyService.getExchangeRate({
      fromCurrencyISO: groupDto.subCurrency,
      toCurrencyISO: groupDto.mainCurrency
    } as ExchangeRateDto)).exchangeRate;
    const db = await dbPromise;
    if (groupDto.tourTemplateId < 0) {
      // 直接创建行程
      const newTour = await db.run(
        `INSERT INTO tours(
          title, status, linkedChannel, channelVisible,
          linkedGroup, startDate, endDate, timeOffset,
          mainCurrency, subCurrency, currencyExchangeRate,
          nodeCopyNames, budgets, locations, transportations,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tourName,
          0,
          linkedChannel,
          0,
          linkedGroup,
          Date.now(),
          Date.now(),
          -480,
          mainCurrency,
          subCurrency,
          currencyExchangeRate,
          JSON.stringify(['默认']),
          JSON.stringify(Array.from({ length: 10 }, (_, index) => ({ title: `预算表${index}`, currency: mainCurrency }))),
          JSON.stringify([[{
            index: 0,
            startOffset: 0,
            endOffset: 0,
            timeOffset: -480,
            note: '',
            title: '上海财经大学',
            longitude: 121.496300,
            latitude: 31.307627,
            expenses: [],
            photos: []
          }]]),
          JSON.stringify([[]]),
          Date.now(),
          Date.now()
        ]
      );
      await this.join(uid, newTour.lastID as number);
    } else {
      // 复制行程模板
      const tourTemplate = await db.get(
        `SELECT * FROM tours WHERE tourId = ?`,
        [tourTemplateId]
      );
      if (!tourTemplate) {
        throw new ParamsError("行程模板不存在");
      }
      const newTour = await db.run(
        `INSERT INTO tours(
          title, status, linkedChannel, channelVisible,
          linkedGroup, startDate, endDate, timeOffset,
          mainCurrency, subCurrency, currencyExchangeRate,
          nodeCopyNames, budgets, locations, transportations,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tourName,
          0,
          linkedChannel,
          0,
          linkedGroup,
          tourTemplate.startDate,
          tourTemplate.endDate,
          tourTemplate.timeOffset,
          tourTemplate.mainCurrency,
          tourTemplate.subCurrency,
          tourTemplate.currencyExchangeRate,
          tourTemplate.nodeCopyNames,
          tourTemplate.budgets,
          tourTemplate.locations,
          tourTemplate.transportations,
          Date.now(),
          Date.now()
        ]
      );
      await this.join(uid, newTour.lastID as number);
    }
  }

  /**
   * 
   * @param uid 
   * @param tourId 
   */
  static async join(uid: number, tourId: number): Promise<void> {
    const db = await dbPromise;
    // 插入用户加入行程的记录，如果之前已经加入过了，就更新 updatedAt
    await db.run(
      `INSERT INTO tour_users (uid, tourId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(uid, tourId) DO UPDATE SET updatedAt = excluded.updatedAt`,
      [
        uid,
        tourId,
        Date.now(),
        Date.now()
      ]
    );
  }

  static async exit(uid: number, tourId: number): Promise<void> {
    const db = await dbPromise;
    // 删除用户加入行程的记录
    await db.run(
      `DELETE FROM tour_users WHERE uid = ? AND tourId = ?`,
      [uid, tourId]
    );
  }

  /**
   * 
   * @param tourId 
   * @returns 
   */
  static async getMembersInTour(tourId: number): Promise<UserDetailVo[]> {
    const db = await dbPromise;
    const rows = await db.all<Partial<User>[]>(
      `
      SELECT uid, nickname, gender, avatarUrl, email,
      phone, signature, birthday, roleId
      FROM users
      WHERE EXISTS (
      SELECT 1 FROM tour_users
      WHERE tour_users.uid = users.uid AND tourId = ?
      )
      `,
      [tourId]
    );
    if (!rows) {
      throw new ParamsError("该行程没有用户");
    }
    return rows.map(row => {
      return {
        uid: row.uid,
        nickname: row.nickname,
        gender: UserUtil.getGenderStr(row.gender),
        avatarUrl: row.avatarUrl,
        email: row.email,
        phone: row.phone,
        signature: row.signature,
        birthday: row.birthday,
        role: RoleUtil.roleNumberToString(row.roleId as number)
      } as UserDetailVo;
    });
  }

  /**
   * 
   * @param tourId 
   * @returns 
   */
  static async getDetailByTourId(tourId: number): Promise<TourBasicVo> {
    const db = await dbPromise;
    const row = await db.get<Partial<Tour>>(
      `
      SELECT tourId, title, status, linkedChannel, channelVisible,
        linkedGroup, startDate, endDate, timeOffset,
        mainCurrency, subCurrency, currencyExchangeRate
      FROM tours
      WHERE tourId = ?
      `,
      [tourId]
    );
    if (!row) {
      throw new ParamsError("该行程不存在");
    }
    return new TourBasicVo(row);
  }

  /**
   * 
   * @param groupId 
   * @returns 
   */
  static async getDetailByGroupId(groupId: number): Promise<TourBasicVo> {
    const db = await dbPromise;
    const row = await db.get<Partial<Tour>>(
      `
      SELECT tourId, title, status, linkedChannel, channelVisible,
        linkedGroup, startDate, endDate, timeOffset,
        mainCurrency, subCurrency, currencyExchangeRate
      FROM tours
      WHERE linkedGroup = ?
      `,
      [groupId]
    );
    if (!row) {
      throw new ParamsError("该行程不存在");
    }
    return new TourBasicVo(row);
  }

  /**
   * 
   * @param tourId 
   * @returns 
   */
  static async getFullByTourId(tourId: number): Promise<TourVo> {
    const db = await dbPromise;
    const row = await db.get<Partial<Tour>>(
      `
      SELECT tourId, title, status, linkedChannel, channelVisible,
        linkedGroup, startDate, endDate, timeOffset,
        mainCurrency, subCurrency, currencyExchangeRate,
        nodeCopyNames, budgets, locations, transportations
      FROM tours
      WHERE tourId = ?
      `,
      [tourId]
    );
    if (!row) {
      throw new ParamsError("该行程不存在");
    }
    const users = await db.all<Partial<{ uid: number }>[]>(
      `
      SELECT uid FROM tour_users WHERE tourId = ?
      `,
      [tourId]
    );
    if (!users) {
      throw new ParamsError("该行程没有用户");
    }
    const { nodeCopyNames, budgets, locations, transportations, ...rowRest } = row;
    return new TourVo({
      ...rowRest,
      users: users.map(user => user.uid!),
      nodeCopyNames: JSON.parse(nodeCopyNames as string),
      budgets: JSON.parse(budgets as string),
      locations: JSON.parse(locations as string),
      transportations: JSON.parse(transportations as string)
    });
  }

  /**
   * 
   * @param tourBasicDto 
   */
  static async updateTourBasic(tourBasicDto: TourBasicDto) {
    const db = await dbPromise;
    const { id: tourId, ...rest } = tourBasicDto;
    await db.run(
      `UPDATE tours SET title = ?, status = ?, linkedChannel = ?, channelVisible = ?,
        linkedGroup = ?, startDate = ?, endDate = ?, timeOffset = ?,
        mainCurrency = ?, subCurrency = ?, currencyExchangeRate = ?,
        updatedAt = ? WHERE tourId = ?`,
      [
        rest.title,
        rest.status,
        rest.linkedChannel,
        rest.channelVisible,
        rest.linkedGroup,
        rest.startDate,
        rest.endDate,
        rest.timeOffset,
        rest.mainCurrency,
        rest.subCurrency,
        rest.currencyExchangeRate,
        Date.now(),
        tourId
      ]
    );
  }

  /**
   * 
   * @param tourDto 
   */
  static async updateTour(tourDto: TourDto) {
    const db = await dbPromise;
    const { id: tourId, ...rest } = tourDto;
    await db.run(
      `UPDATE tours SET title = ?, status = ?, linkedChannel = ?, channelVisible = ?,
        linkedGroup = ?, startDate = ?, endDate = ?, timeOffset = ?,
        mainCurrency = ?, subCurrency = ?, currencyExchangeRate = ?,
        nodeCopyNames = ?, budgets = ?, locations = ?, transportations = ?,
        updatedAt = ? WHERE tourId = ?`,
      [
        rest.title,
        rest.status,
        rest.linkedChannel,
        rest.channelVisible,
        rest.linkedGroup,
        rest.startDate,
        rest.endDate,
        rest.timeOffset,
        rest.mainCurrency,
        rest.subCurrency,
        rest.currencyExchangeRate,
        JSON.stringify(rest.nodeCopyNames),
        JSON.stringify(rest.budgets),
        JSON.stringify(rest.locations),
        JSON.stringify(rest.transportations),
        Date.now(),
        tourId
      ]
    );
  }
}

export default TourService;