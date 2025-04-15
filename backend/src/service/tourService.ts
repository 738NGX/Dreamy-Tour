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
import LocationPhotosDto from "@/dto/image/locationPhotosDto";
import CosUtil from "@/util/cosUtil";
import CosConstant from "@/constant/cosConstant";
import TourSavesVo from "@/vo/tour/tourSavesVo";

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
          1,
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
      // 地点需要删除所有的照片，防止链接重复引用
      const locations = JSON.parse(tourTemplate.locations as string);
      locations.forEach((copy: any[]) => {
        copy.forEach((location: any) => {
          location.photos = [];
        });
      });
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
          1,
          linkedGroup,
          tourTemplate.startDate,
          tourTemplate.endDate,
          tourTemplate.timeOffset,
          tourTemplate.mainCurrency,
          tourTemplate.subCurrency,
          tourTemplate.currencyExchangeRate,
          tourTemplate.nodeCopyNames,
          tourTemplate.budgets,
          locations,
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

  static async getTourSavesByChannelId(channelId: number): Promise<TourSavesVo[]> {
    const db = await dbPromise;
    const rows = await db.all<Partial<Tour>[]>(
      `
      SELECT tourId, title, status, linkedChannel, channelVisible,
        startDate, endDate, locations
      FROM tours
      WHERE linkedChannel = ? AND channelVisible = 1 AND status = 2
      `,
      [channelId]
    );
    if (!rows) {
      throw new ParamsError("频道内不存在行程");
    }
    return await Promise.all(
      rows.map(async row => {
        // 查询关联用户
        const users = await db.all<Partial<{ uid: number }>[]>(`
          SELECT uid FROM tour_users WHERE tourId = ?
        `, [row.tourId]);

        if (!users || users.length === 0) {
          throw new ParamsError("该行程没有关联用户");
        }

        const { locations, ...rowRest } = row;

        const locationsCopy = locations ? JSON.parse(locations as string) : [];
        // 过滤掉没有照片的地点
        const filteredLocationsWithPhotos = locationsCopy.map((copy: any[]) => {
          return copy.filter((location: any) => location.photos && location.photos.length > 0);
        });

        return new TourSavesVo({
          ...rowRest,
          locations: filteredLocationsWithPhotos,
          users: users.map(user => user.uid!),
        });
      })
    );
  }

  static async getTourSavesByUserId(userId: number): Promise<TourSavesVo[]> {
    const db = await dbPromise;
    const rows = await db.all<Partial<Tour>[]>(
      `
      SELECT tourId, title, status, channelVisible, startDate, endDate, locations
      FROM tours
      WHERE status = 2 AND EXISTS (
        SELECT 1 FROM tour_users WHERE tour_users.tourId = tours.tourId AND uid = ?
      )
      `,
      [userId]
    );
    if (!rows) {
      throw new ParamsError("该用户没有行程");
    }
    return await Promise.all(
      rows.map(async row => {
        const { locations, ...rowRest } = row;

        const locationsCopy = locations ? JSON.parse(locations as string) : [];
        // 过滤掉没有照片的地点
        const filteredLocationsWithPhotos = locationsCopy.map((copy: any[]) => {
          return copy.filter((location: any) => location.photos && location.photos.length > 0);
        });

        return new TourSavesVo({
          ...rowRest,
          locations: filteredLocationsWithPhotos,
        });
      })
    );
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

  static async updateTourLocationPhotos(locationPhotosDto: LocationPhotosDto) {
    const { tourId, copyIndex, locationIndex, photos } = locationPhotosDto;
  
    // 1. 从数据库中反序列化原始的行程locations数据
    const db = await dbPromise;
    const row = await db.get<Partial<{ locations: string }>>(
      `SELECT locations FROM tours WHERE tourId = ?`,
      [tourId]
    );
    if (!row) {
      throw new ParamsError("该行程不存在");
    }
    const locations = JSON.parse(row.locations as string);
    
    // 假设locations的数据结构为二维数组或者对象，通过copyIndex和locationIndex定位当前位置的数据
    const currentLocation = locations[copyIndex][locationIndex];
    // 旧照片列表（可能为空），其中每个元素形如 { ariaLabel: '', value: url }
    const oldPhotos: any[] = currentLocation.photos || [];
    
    // 2. 将旧照片列表中过滤出有效的COS链接
    const oldCosUrls = oldPhotos
      .filter(photo => CosUtil.isValidCosUrl(photo.value))
      .map(photo => photo.value);
    
    // 3. 如果传入的photos为空或数组长度为0，则将所有原有COS文件删除，并清空照片列表
    if (!photos || photos.length === 0) {
      if (oldCosUrls.length > 0) {
        const deletePromises = oldCosUrls.map(async (url) => {
          return await CosUtil.deleteFile(url);
        });
        await Promise.all(deletePromises);
      }
      // 清空当前位置信息中的照片并写回DB
      currentLocation.photos = [];
      await db.run(
        `UPDATE tours SET locations = ? WHERE tourId = ?`,
        [JSON.stringify(locations), tourId]
      );
      return;
    }
    
    // 4. 从传入的新照片列表中筛选出已有的COS链接（无需重新上传）
    const newPhotosCosUrls = photos.filter(photo => CosUtil.isValidCosUrl(photo));
    
    // 5. 找出旧照片中存在但在新列表中已不再保留的COS链接，依此删除
    const urlsToDelete = oldCosUrls.filter(url => !newPhotosCosUrls.includes(url));
    if (urlsToDelete.length > 0) {
      const deletePromises = urlsToDelete.map(async (url) => {
        return await CosUtil.deleteFile(url);
      });
      await Promise.all(deletePromises);
    }
    
    // 6. 对新照片列表中非COS链接（即base64文件）进行上传处理
    const uploadPromises = photos.map(async (photo) => {
      if (!CosUtil.isValidCosUrl(photo)) {
        // 新的Base64文件上传到COS，返回上传后的COS链接
        return await CosUtil.uploadBase64Picture(CosConstant.TOUR_PICTURES_FOLDER, photo);
      } else {
        // 已经是COS链接的直接返回
        return photo;
      }
    });
    const processedPhotoUrls = await Promise.all(uploadPromises);
    
    // 7. 更新当前位置信息中的照片数组，封装成统一格式（{ ariaLabel: '', value: url }）
    currentLocation.photos = processedPhotoUrls.map(url => ({ ariaLabel: '', value: url }));
    
    // 8. 序列化locations数据，并写回数据库
    await db.run(
      `UPDATE tours SET locations = ? WHERE tourId = ?`,
      [JSON.stringify(locations), tourId]
    );
  }  
}

export default TourService;