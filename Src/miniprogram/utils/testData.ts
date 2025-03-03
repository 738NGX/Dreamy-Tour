import { ChannelLevel } from "./channel/channel";
import { Currency } from "./tour/expense";
import { TourStatus } from "./tour/tour";
import { MILLISECONDS } from "./util";

export const userList = [
  {
    id: 0,
    name: 'admin',
    isAdmin: true,
  },
  {
    id: 1,
    name: '738NGX',
    isAdmin: true,
    adminingChannel: [3],
  },
  {
    id: 2,
    name: '明曌',
    havingChannel: [3],
  },
  {
    id: 3,
    name: '希可',
    adminingChannel: [3],
  },
  {
    id: 4,
    name: '可可乐',
    adminingChannel: [3],
  },
  {
    id: 5,
    name: 'CZ',
    adminingChannel: [3],
  },
  {
    id: 6,
    name: '消除',
    adminingChannel: [3],
  },
  {
    id: 7,
    name: '吉尔',
    exp: 6666
  },
  {
    id: 8,
    name: '霧谷',
    adminingChannel: [3],
  },
  {
    id: 9,
    name: '鲤条',
  },
]

export const channelList = [
  {
    id: 1,
    name: '世界频道',
    description: '大家一起实现梦想的公共频道',
    level: ChannelLevel.S,
  },
  {
    id: 2,
    name: 'Aqours远征群',
    description: '爱生活! 艳阳天!',
    level: ChannelLevel.A,
  },
  {
    id: 3,
    name: '上财辣辣人同好会',
    description: 'みんなで叶える物語',
    level: ChannelLevel.B,
  },
]

export const tourList = [
  {
    id: 1,
    title: '异次元歌合战',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [3, 5],
    startDate: new Date('2023-12-09').getTime(),
    endDate: new Date('2023-12-11').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [
      {
        index: 0,
        title: '东京巨蛋',
        startOffset: 0,
        endOffset: 0,
        timeOffset: -540,
        longitude: 139.751907,
        latitude: 35.705655,
        photos: [
          {
            value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-06-20-17-19.png?sign=ZmbW4ZzthDvuwB9pXYCmy6G8Iqw3B60hsVXglHjRAhw=:0',
            ariaLabel: ''
          }
        ]
      }
    ],
    transportations: []
  },
  {
    id: 2,
    title: '虹咲6th神奈川公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [1, 2, 5, 9],
    startDate: new Date('2024-01-12').getTime(),
    endDate: new Date('2024-01-18').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [
      {
        index: 0,
        title: 'K-Arena 横滨',
        startOffset: MILLISECONDS.DAY * 2,
        endOffset: MILLISECONDS.DAY * 2,
        timeOffset: -540,
        longitude: 139.630450,
        latitude: 35.464577,
        photos: [
          {
            value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-06-20-17-23(2).png?sign=icBvSdBvk826Bq6SLJr2nsGsSurixtyD4qv9iPohTns=:0',
            ariaLabel: ''
          },
          {
            value: 'https://www.738ngx.site/wp-content/uploads/2024/01/Image_1705238239620-1024x768.jpg',
            ariaLabel: ''
          },
          {
            value: 'https://www.738ngx.site/wp-content/uploads/2024/01/Screenshot_20240113_224257_edit_54356404425618-1024x584.jpg',
            ariaLabel: ''
          }
        ]
      },
      {
        index: 1,
        title: '沼津',
        startOffset: MILLISECONDS.DAY * 3,
        endOffset: MILLISECONDS.DAY * 3,
        timeOffset: -540,
        longitude: 138.897322,
        latitude: 35.020714,
        photos: [
          {
            value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9450-1024x683.jpg',
            ariaLabel: ''
          },
          {
            value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9476-1024x683.jpg',
            ariaLabel: ''
          },
          {
            value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9653-1024x683.jpg',
            ariaLabel: ''
          }
        ]
      }
    ],
    transportations: []
  },
  {
    id: 3,
    title: 'LoveLive! Orchestra Concert',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [2, 4, 7],
    startDate: new Date('2024-03-28').getTime(),
    endDate: new Date('2024-04-01').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 4,
    title: '莲之空2nd兵库公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [6],
    startDate: new Date('2024-05-18').getTime(),
    endDate: new Date('2024-05-20').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 5,
    title: 'Liella2024FMT爱知公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [5],
    startDate: new Date('2024-05-03').getTime(),
    endDate: new Date('2024-05-04').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 5,
    title: 'Liella2024FMT宫城公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [6],
    startDate: new Date('2024-06-20').getTime(),
    endDate: new Date('2024-06-21').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 6,
    title: 'Liella2024FMT神奈川公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [6],
    startDate: new Date('2024-08-03').getTime(),
    endDate: new Date('2024-08-04').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 7,
    title: 'ASL2024',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [6],
    startDate: new Date('2024-08-31').getTime(),
    endDate: new Date('2024-08-31').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 8,
    title: 'LoveLive!亚巡2024广州上海公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [1, 3, 5, 8],
    startDate: new Date('2024-10-02').getTime(),
    endDate: new Date('2024-10-06').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 9,
    title: '虹咲7th',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [1, 5, 9],
    startDate: new Date('2024-10-18').getTime(),
    endDate: new Date('2024-10-21').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 10,
    title: '莲之空3nd神奈川公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [6, 8],
    startDate: new Date('2025-01-10').getTime(),
    endDate: new Date('2025-01-11').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
  {
    id: 11,
    title: 'LoveLive!亚巡2024神奈川公演',
    status: TourStatus.Finished,
    linkedChannel: 3,
    users: [6],
    startDate: new Date('2025-02-01').getTime(),
    endDate: new Date('2025-02-02').getTime(),
    timeOffset: -540,
    mainCurrency: Currency.CNY,
    subCurrency: Currency.JPY,
    currencyExchangeRate: 0.049,
    locations: [],
    transportations: []
  },
]

export const postList = [
  {
    id: 1,
    title: '欢迎来到上财辣辣人同好会',
    content: `欢迎各位来到上财辣辣人同好会。我们是一个以上财学生为主的致力于为Love Live及其衍生企划应援的自由民间组织，并不依托任何社团或者协会，因此所有活动纯属用爱发电，希望在这里能够让大家自由释放对企划的热爱。`,
    linkedChannel: 3,
    user: 2,
    time: new Date(2023, 5, 5).getTime(),
    likes: [1, 3, 5],
    isSticky: true,
    photos: [
      {
        value: 'https://www.738ngx.site/api/rinachanboard/images/maintheme.jpg',
        ariaLabel: ''
      },
      {
        value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-06-17-53(1).jpg?sign=DpWOquEwjUtWFPT_worI_6D7CKhvdAiUCb-7h65VI9M=:0',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 2,
    title: '台场夜游',
    content: ``,
    linkedChannel: 3,
    user: 2,
    time: new Date(2024, 0, 12).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9346-683x1024.jpg',
        ariaLabel: ''
      },
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9353-1024x693.jpg',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 3,
    title: 'Aqours Sunshine!!',
    content: ``,
    linkedChannel: 3,
    user: 1,
    time: new Date(2024, 0, 15).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9476-1024x683.jpg',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 4,
    title: 'Yeah Tiger✌🐯',
    content: ``,
    linkedChannel: 3,
    user: 7,
    time: new Date(2024, 0, 15).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/IMG_20240115_153757-1024x768.jpg',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 5,
    title: '长颈鹿正在从四面八方赶来',
    content: ``,
    linkedChannel: 3,
    user: 1,
    time: new Date(2024, 0, 17).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/IMG_20240116_234644-768x1024.jpg',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 6,
    title: '哐哐蜜柑🍊',
    content: ``,
    linkedChannel: 3,
    user: 1,
    time: new Date(2024, 0, 16).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/rebuilt-9552-1024x683.jpg',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 7,
    title: '原宿的可丽饼',
    content: ``,
    linkedChannel: 3,
    user: 3,
    time: new Date(2024, 0, 18).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://www.738ngx.site/wp-content/uploads/2024/01/IMG_20240117_103519-768x1024.jpg',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 8,
    title: '寿司沼津港🍣',
    content: ``,
    linkedChannel: 3,
    user: 4,
    time: new Date(2024, 5, 22).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-06-22-17-12.jpg?sign=NV8dFZktM7Py7Oso8e9Te28p1Dp7Rw9kVWFglvxSIDg=:0',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 9,
    title: '广州 到达!',
    content: ``,
    linkedChannel: 3,
    user: 3,
    time: new Date(2024, 9, 3).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-03-10-03.jpg?sign=vqOUL-Gjkht62flkVu1qFhfPklgOx_bXr3qh2-I_F1M=:0',
        ariaLabel: ''
      },
    ]
  },
  {
    id: 10,
    title: '12,34567',
    content: ``,
    linkedChannel: 3,
    user: 7,
    time: new Date(2024, 5, 22).getTime(),
    likes: [],
    isSticky: false,
    photos: [
      {
        value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/Liyuu/2024-06-23-02-03.jpg?sign=BsPWWDzpupjkaG7RWBn6Hqu2ytd2z1Zq0_U31iLx2VU=:0',
        ariaLabel: ''
      },
    ]
  },
]

export const commentList = [
  {
    id: 1,
    content: '饱饱',
    user: 1,
    time: new Date(2023, 5, 6).getTime(),
    likes: [2, 3, 5, 4],
    linkedPost: 1,
    parentComment: -1,
    photos: [
    ]
  },
  {
    id: 2,
    content: '饱饱饱',
    user: 2,
    time: new Date(2023, 5, 7).getTime(),
    likes: [1, 3, 5],
    linkedPost: 1,
    parentComment: 1,
    photos: [
    ]
  },
  {
    id: 3,
    content: '饱饱饱饱',
    user: 3,
    time: new Date(2023, 5, 8).getTime(),
    likes: [1, 5],
    linkedPost: 1,
    parentComment: 2,
    photos: [
    ]
  },
  {
    id: 4,
    content: '饱饱饱饱饱',
    user: 4,
    time: new Date(2023, 5, 9).getTime(),
    likes: [],
    linkedPost: 1,
    parentComment: 3,
    photos: [
    ]
  },
  {
    id: 5,
    content: '饱饱饱饱饱饱',
    user: 7,
    time: new Date(2023, 5, 5).getTime(),
    likes: [],
    linkedPost: 1,
    parentComment: 1,
    photos: [
    ]
  },
  {
    id: 5,
    content: '我是奶龙',
    user: 7,
    time: new Date(2023, 5, 5).getTime(),
    likes: [1, 2, 3],
    linkedPost: 1,
    parentComment: -1,
    photos: [
      {
        value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E5%90%89%E5%B0%94/2024-10-27-21-37.jpg?sign=l5bZV3quzloDnys7hdQbr3SslsIfWCa8J2muK8J4rDc=:0',
        ariaLabel: ''
      },
    ]
  }
]