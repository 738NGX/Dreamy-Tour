import { Currency, ExpenseType, TransportType } from "../../tour/expense";
import { TourStatus } from "../../tour/tour";
import { MILLISECONDS } from "../../util";

const timestamps = [
  0,
  MILLISECONDS.HOUR * 3 + MILLISECONDS.MINUTE * 20,
  MILLISECONDS.HOUR * 4 + MILLISECONDS.MINUTE * 10,
  MILLISECONDS.HOUR * 6 + MILLISECONDS.MINUTE * 15,
  MILLISECONDS.HOUR * 8 + MILLISECONDS.MINUTE * 43,
  MILLISECONDS.HOUR * 9 + MILLISECONDS.MINUTE * 22,
  MILLISECONDS.HOUR * 10 + MILLISECONDS.MINUTE * 0,
  MILLISECONDS.HOUR * 10 + MILLISECONDS.MINUTE * 10,
  MILLISECONDS.HOUR * 10 + MILLISECONDS.MINUTE * 37,
  MILLISECONDS.HOUR * 10 + MILLISECONDS.MINUTE * 40,
  MILLISECONDS.HOUR * 11 + MILLISECONDS.MINUTE * 34,
  MILLISECONDS.HOUR * 12 + MILLISECONDS.MINUTE * 10,
  MILLISECONDS.HOUR * 12 + MILLISECONDS.MINUTE * 15,
  MILLISECONDS.HOUR * 12 + MILLISECONDS.MINUTE * 40,
  MILLISECONDS.HOUR * 12 + MILLISECONDS.MINUTE * 45,
  MILLISECONDS.HOUR * 13 + MILLISECONDS.MINUTE * 40,
  MILLISECONDS.HOUR * 14 + MILLISECONDS.MINUTE * 5,
  MILLISECONDS.HOUR * 15 + MILLISECONDS.MINUTE * 50,
  MILLISECONDS.HOUR * 16 + MILLISECONDS.MINUTE * 5,
  MILLISECONDS.HOUR * 16 + MILLISECONDS.MINUTE * 7,
  MILLISECONDS.HOUR * 16 + MILLISECONDS.MINUTE * 34,
  MILLISECONDS.HOUR * 17 + MILLISECONDS.MINUTE * 23,
  MILLISECONDS.HOUR * 17 + MILLISECONDS.MINUTE * 35,
  MILLISECONDS.HOUR * 19 + MILLISECONDS.MINUTE * 30,
  MILLISECONDS.HOUR * 19 + MILLISECONDS.MINUTE * 45,
  MILLISECONDS.HOUR * 21 + MILLISECONDS.MINUTE * 0,
  MILLISECONDS.HOUR * 21 + MILLISECONDS.MINUTE * 15,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 8 + MILLISECONDS.MINUTE * 15,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 9 + MILLISECONDS.MINUTE * 54,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 12 + MILLISECONDS.MINUTE * 37,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 14 + MILLISECONDS.MINUTE * 16,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 15 + MILLISECONDS.MINUTE * 21,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 16 + MILLISECONDS.MINUTE * 20,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 20 + MILLISECONDS.MINUTE * 40,
  MILLISECONDS.DAY * 1 + MILLISECONDS.HOUR * 21 + MILLISECONDS.MINUTE * 10,
  MILLISECONDS.DAY * 2 + MILLISECONDS.HOUR * 9 + MILLISECONDS.MINUTE * 5,
  MILLISECONDS.DAY * 2 + MILLISECONDS.HOUR * 9 + MILLISECONDS.MINUTE * 34,
  MILLISECONDS.DAY * 2 + MILLISECONDS.HOUR * 14 + MILLISECONDS.MINUTE * 38,
  MILLISECONDS.DAY * 2 + MILLISECONDS.HOUR * 15 + MILLISECONDS.MINUTE * 20,
  MILLISECONDS.DAY * 2 + MILLISECONDS.HOUR * 21 + MILLISECONDS.MINUTE * 15,
  MILLISECONDS.DAY * 2 + MILLISECONDS.HOUR * 22 + MILLISECONDS.MINUTE * 30,
  MILLISECONDS.DAY * 3 + MILLISECONDS.HOUR * 0 + MILLISECONDS.MINUTE * 30,
  MILLISECONDS.DAY * 3 + MILLISECONDS.HOUR * 3 + MILLISECONDS.MINUTE * 25,
  MILLISECONDS.DAY * 3 + MILLISECONDS.HOUR * 4 + MILLISECONDS.MINUTE * 0,
  MILLISECONDS.DAY * 3 + MILLISECONDS.HOUR * 4 + MILLISECONDS.MINUTE * 45,
  MILLISECONDS.DAY * 3 + MILLISECONDS.HOUR * 5 + MILLISECONDS.MINUTE * 30,
]

export const niji7th = {
  id: 9,
  title: '虹咲7th',
  status: TourStatus.Finished,
  linkedChannel: 3,
  users: [1, 5, 9],
  startDate: new Date(2024, 9, 18).getTime(),
  endDate: new Date(2024, 9, 22).getTime() - MILLISECONDS.MINUTE,
  timeOffset: -540,
  mainCurrency: Currency.CNY,
  subCurrency: Currency.JPY,
  currencyExchangeRate: 0.049,
  locations: [[
    {
      index: 0,
      title: '上海财经大学',
      startOffset: timestamps[0],
      endOffset: timestamps[1],
      timeOffset: -480,
      longitude: 121.4963,
      latitude: 31.307627,
    },
    {
      index: 1,
      title: '浦东国际机场T2',
      startOffset: timestamps[2],
      endOffset: timestamps[3],
      timeOffset: -480,
      longitude: 121.802307,
      latitude: 31.149342,
    },
    {
      index: 2,
      title: '成田空港T3',
      startOffset: timestamps[4],
      endOffset: timestamps[5],
      timeOffset: -540,
      longitude: 140.387671,
      latitude: 35.772751,
    },
    {
      index: 3,
      title: '日暮里站',
      startOffset: timestamps[6],
      endOffset: timestamps[7],
      timeOffset: -540,
      longitude: 139.771226,
      latitude: 35.727910,
    },
    {
      index: 4,
      title: '品川站',
      startOffset: timestamps[8],
      endOffset: timestamps[9],
      timeOffset: -540,
      longitude: 139.738934,
      latitude: 35.628838,
    },
    {
      index: 5,
      title: '汐入站',
      startOffset: timestamps[10],
      endOffset: timestamps[11],
      timeOffset: -540,
      longitude: 139.662494,
      latitude: 35.280489,
    },
    {
      index: 6,
      title: 'COASKA海湾商店',
      startOffset: timestamps[12],
      endOffset: timestamps[13],
      timeOffset: -540,
      longitude: 139.662791,
      latitude: 35.281256,
    },
    {
      index: 7,
      title: '横须贺海军设施',
      startOffset: timestamps[14],
      endOffset: timestamps[15],
      timeOffset: -540,
      longitude: 139.662242,
      latitude: 35.284192,
    },
    {
      index: 8,
      title: '三笠公园',
      startOffset: timestamps[16],
      endOffset: timestamps[17],
      timeOffset: -540,
      longitude: 139.673979,
      latitude: 35.285844,
    },
    {
      index: 9,
      title: '横须贺中央站',
      startOffset: timestamps[18],
      endOffset: timestamps[19],
      timeOffset: -540,
      longitude: 139.670336,
      latitude: 35.278585,
    },
    {
      index: 10,
      title: '横滨站',
      startOffset: timestamps[20],
      endOffset: timestamps[21],
      timeOffset: -540,
      longitude: 139.622968,
      latitude: 35.466316,
    },
    {
      index: 11,
      title: '港未来',
      startOffset: timestamps[22],
      endOffset: timestamps[23],
      timeOffset: -540,
      longitude: 139.633065,
      latitude: 35.457082,
    },
    {
      index: 12,
      title: 'K-Arena 横滨',
      startOffset: timestamps[24],
      endOffset: timestamps[25],
      timeOffset: -540,
      longitude: 139.630450,
      latitude: 35.464577,
    },
    {
      index: 13,
      title: '横滨洲际大酒店',
      startOffset: timestamps[26],
      endOffset: timestamps[27],
      timeOffset: -540,
      longitude: 139.637209,
      latitude: 35.457829,
    },
    {
      index: 14,
      title: '台场',
      startOffset: timestamps[28],
      endOffset: timestamps[29],
      timeOffset: -540,
      longitude: 139.771433,
      latitude: 35.625825,
    },
    {
      index: 15,
      title: '秋叶原',
      startOffset: timestamps[30],
      endOffset: timestamps[31],
      timeOffset: -540,
      longitude: 139.772998,
      latitude: 35.698491,
    },
    {
      index: 16,
      title: 'K-Arena 横滨',
      startOffset: timestamps[32],
      endOffset: timestamps[33],
      timeOffset: -540,
      longitude: 139.630666,
      latitude: 35.464573,
    },
    {
      index: 17,
      title: '川崎',
      startOffset: timestamps[34],
      endOffset: timestamps[35],
      timeOffset: -540,
      longitude: 139.696840,
      latitude: 35.531371,
    },
    {
      index: 18,
      title: '台场',
      startOffset: timestamps[36],
      endOffset: timestamps[37],
      timeOffset: -540,
      longitude: 139.779078,
      latitude: 35.627694,
    },
    {
      index: 19,
      title: 'K-Arena 横滨',
      startOffset: timestamps[38],
      endOffset: timestamps[39],
      timeOffset: -540,
      longitude: 139.630679,
      latitude: 35.464501,
    },
    {
      index: 20,
      title: '羽田空港T3',
      startOffset: timestamps[40],
      endOffset: timestamps[41],
      timeOffset: -540,
      longitude: 139.784460,
      latitude: 35.548252,
    },
    {
      index: 21,
      title: '浦东国际机场T2',
      startOffset: timestamps[42],
      endOffset: timestamps[43],
      timeOffset: -480,
      longitude: 121.808501,
      latitude: 31.133173,
    },
    {
      index: 22,
      title: '上海财经大学',
      startOffset: timestamps[44],
      endOffset: timestamps[45],
      timeOffset: -480,
      longitude: 121.495612,
      latitude: 31.304187,
    },
  ]],
  transportations: [[
    {
      index: 0,
      startOffset: timestamps[1],
      endOffset: timestamps[2],
      transportExpenses: [
        {
          index: 0,
          title: '飞猪送机',
          amount: 126,
          currency: Currency.CNY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Taxi,
          note: ''
        }
      ]
    },
    {
      index: 1,
      startOffset: timestamps[3],
      endOffset: timestamps[4],
      transportExpenses: [
        {
          index: 0,
          title: '9C6129 PVG-NRT',
          amount: 600,
          currency: Currency.CNY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Flight,
          note: ''
        }
      ]
    },
    {
      index: 2,
      startOffset: timestamps[5],
      endOffset: timestamps[6],
      transportExpenses: [
        {
          index: 0,
          title: '京成Skyliner',
          amount: 1267,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '京成上野方面 特急'
        },
        {
          index: 1,
          title: 'Skyliner特急券',
          amount: 1300,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
        {
          index: 2,
          title: 'Sucia充值',
          amount: 74,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Other,
          note: ''
        },
      ]
    },
    {
      index: 3,
      startOffset: timestamps[7],
      endOffset: timestamps[8],
      transportExpenses: [
        {
          index: 0,
          title: 'JR山手线',
          amount: 208,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '外回 上野·东京·品川·目黑方面'
        }
      ]
    },
    {
      index: 4,
      startOffset: timestamps[9],
      endOffset: timestamps[10],
      transportExpenses: [
        {
          index: 0,
          title: '京急本线',
          amount: 620,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '京急久里滨方面 快特\n金泽八景 换乘 浦贺方面 普通'
        }
      ]
    },
    {
      index: 5,
      startOffset: timestamps[11],
      endOffset: timestamps[12],
      transportExpenses: [
        {
          index: 0,
          title: '步行',
          amount: 0,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Walk,
          note: ''
        }
      ]
    },
    {
      index: 6,
      startOffset: timestamps[13],
      endOffset: timestamps[14],
      transportExpenses: [
        {
          index: 0,
          title: '步行',
          amount: 0,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Walk,
          note: ''
        }
      ]
    },
    {
      index: 7,
      startOffset: timestamps[15],
      endOffset: timestamps[16],
      transportExpenses: [
        {
          index: 0,
          title: '步行',
          amount: 0,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Walk,
          note: ''
        }
      ]
    },
    {
      index: 8,
      startOffset: timestamps[17],
      endOffset: timestamps[18],
      transportExpenses: [
        {
          index: 0,
          title: '步行',
          amount: 0,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Walk,
          note: ''
        }
      ]
    },
    {
      index: 9,
      startOffset: timestamps[19],
      endOffset: timestamps[20],
      transportExpenses: [
        {
          index: 0,
          title: '京急本线',
          amount: 403,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '品川方面 快特'
        }
      ]
    },
    {
      index: 10,
      startOffset: timestamps[21],
      endOffset: timestamps[22],
      transportExpenses: [
        {
          index: 0,
          title: '港未来线',
          amount: 193,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '元町中华街方面 急行'
        }
      ]
    },
    {
      index: 11,
      startOffset: timestamps[23],
      endOffset: timestamps[24],
      transportExpenses: [
        {
          index: 0,
          title: '港未来线',
          amount: 193,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '横滨方面 各停'
        }
      ]
    },
    {
      index: 12,
      startOffset: timestamps[25],
      endOffset: timestamps[26],
      transportExpenses: [
        {
          index: 0,
          title: '步行',
          amount: 0,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Walk,
          note: ''
        }
      ]
    },
    {
      index: 13,
      startOffset: timestamps[27],
      endOffset: timestamps[28],
      transportExpenses: [
        {
          index: 0,
          title: '港未来线',
          amount: 193,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '和光市方面 急行 横滨站换乘'
        },
        {
          index: 1,
          title: 'JR东海道线',
          amount: 230,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '宇都宫方面 川崎下'
        },
        {
          index: 2,
          title: 'JR东海道线',
          amount: 318,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '高崎方面 新桥下'
        },
        {
          index: 3,
          title: '海鸥线',
          amount: 321,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '台场方面'
        }
      ]
    },
    {
      index: 14,
      startOffset: timestamps[29],
      endOffset: timestamps[30],
      transportExpenses: [
        {
          index: 0,
          title: '海鸥线-JR山手线',
          amount: 325,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '秋叶原下'
        },
      ]
    },
    {
      index: 15,
      startOffset: timestamps[31],
      endOffset: timestamps[32],
      transportExpenses: [
        {
          index: 0,
          title: 'JR山手线-JR东海道线',
          amount: 571,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: '横滨下'
        },
      ]
    },
    {
      index: 16,
      startOffset: timestamps[33],
      endOffset: timestamps[34],
      transportExpenses: [
        {
          index: 0,
          title: 'JR东海道线',
          amount: 230,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
      ]
    },
    {
      index: 17,
      startOffset: timestamps[35],
      endOffset: timestamps[36],
      transportExpenses: [
        {
          index: 0,
          title: 'JR京滨东北线-临海线',
          amount: 450,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
      ]
    },
    {
      index: 18,
      startOffset: timestamps[37],
      endOffset: timestamps[38],
      transportExpenses: [
        {
          index: 0,
          title: '海鸥线',
          amount: 251,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
        {
          index: 1,
          title: '海鸥线-JR东海道线',
          amount: 820,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
        {
          index: 2,
          title: '东海道线Green Car',
          amount: 1010,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
      ]
    },
    {
      index: 19,
      startOffset: timestamps[39],
      endOffset: timestamps[40],
      transportExpenses: [
        {
          index: 0,
          title: 'JR东海道线',
          amount: 230,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
        {
          index: 1,
          title: '京急本线',
          amount: 283,
          currency: Currency.JPY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Metro,
          note: ''
        },
      ]
    },
    {
      index: 20,
      startOffset: timestamps[41],
      endOffset: timestamps[42],
      transportExpenses: [
        {
          index: 0,
          title: '9C8516 HND-PVG',
          amount: 803,
          currency: Currency.CNY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Flight,
          note: ''
        },
      ]
    },
    {
      index: 21,
      startOffset: timestamps[43],
      endOffset: timestamps[44],
      transportExpenses: [
        {
          index: 0,
          title: '飞猪接机',
          amount: 140,
          currency: Currency.CNY,
          type: ExpenseType.Transportation,
          transportType: TransportType.Taxi,
          note: ''
        },
      ]
    },
  ]]
}
