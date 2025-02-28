import { ChannelLevel } from "./channel/channel";
import { Currency } from "./tour";
import { MILLISECONDS } from "./util";

export const userList = [
  {
    id: 0,
    name: 'admin',
  },
  {
    id: 1,
    name: '738NGX',
  },
  {
    id: 2,
    name: '明曌',
  },
  {
    id: 3,
    name: '希可',
  },
  {
    id: 4,
    name: '可可乐',
  },
  {
    id: 5,
    name: 'CZ',
  },
  {
    id: 6,
    name: '消除',
  },
  {
    id: 7,
    name: '吉尔',
  },
  {
    id: 8,
    name: '霧谷',
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
    tourSaves: [],
  },
  {
    id: 2,
    name: 'Aqours远征群',
    description: '爱生活! 艳阳天!',
    level: ChannelLevel.A,
    tourSaves: [],
  },
  {
    id: 3,
    name: '上财辣辣人同好会',
    description: 'みんなで叶える物語',
    level: ChannelLevel.B,
    tourSaves: [
      {
        id: 1,
        title: '异次元歌合战',
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
    ],
  },
]