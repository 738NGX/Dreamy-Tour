import { Currency } from "../tour/expense";
import { TourStatus } from "../tour/tour";
import { MILLISECONDS } from "../util";
import { niji7th } from "./tours/niji7th";

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
      [{
        index: 0,
        title: '東京ドーム',
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
      }]
    ],
    transportations: [[]]
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
    nodeCopyNames: ['默认', '沼津巡礼'],
    locations: [
      [
        {
          index: 0,
          title: 'K-Arena Yokohama',
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
      ],
      [
        {
          index: 0,
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
        },
      ]
    ],
    transportations: [[], []]
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
    locations: [
      [{
        index: 0,
        title: 'パシフィコ横浜 国立大ホール',
        startOffset: 0,
        endOffset: 0,
        timeOffset: -540,
        longitude: 139.637008,
        latitude: 35.458610,
        photos: [
          {
            value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-06-20-17-20.png?sign=DvKZthh1DEpEIwpJVemUNYGdiQVmBNKBXT2jmBtCfo8=:0',
            ariaLabel: ''
          }
        ]
      }]
    ],
    transportations: [[]]
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
    locations: [
      [{
        index: 0,
        title: '神戸ワールド記念ホール',
        startOffset: 0,
        endOffset: 0,
        timeOffset: -540,
        longitude: 135.210206,
        latitude: 34.664392,
        photos: [
          {
            value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-07-16-16-42.jpg?sign=3haa5D7BrrpeK_H4ame-DB5ppb2yLp6Xe4WBHRQCO9Q=:0',
            ariaLabel: ''
          }
        ]
      }]
    ],
    transportations: [[]]
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
    locations: [
      [{
        index: 0,
        title: '名古屋国際会議場',
        startOffset: 0,
        endOffset: 0,
        timeOffset: -540,
        longitude: 136.898369,
        latitude: 35.131579,
        photos: [
          {
            value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-06-20-22-56.png?sign=H3vFZT7-hMaD9dPLv_Gvcsv6-sBTZBRFJMBAa2-2_5M=:0',
            ariaLabel: ''
          }
        ]
      }]
    ],
    transportations: [[]]
  },
  {
    id: 6,
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
    locations: [
      [{
        index: 0,
        title: '仙台サンプラザホール',
        startOffset: 0,
        endOffset: 0,
        timeOffset: -540,
        longitude: 140.893959,
        latitude: 38.257658,
        photos: [
          {
            value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-04-23-36(1).jpg?sign=ybrr5vh-L0Bs2J5aTlYZj_to8ugeJtHU19gy33r8bng=:0',
            ariaLabel: ''
          }
        ]
      }]
    ],
    transportations: [[]]
  },
  {
    id: 7,
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
    nodeCopyNames: ['默认', '金泽巡礼'],
    locations: [
      [
        {
          index: 0,
          title: 'K-Arena Yokohama',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 139.630450,
          latitude: 35.464577,
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-04-23-36(3).jpg?sign=FXUnrZCry_k4MgrXyejWkh0Syw2jXc3lAX5Q57t7wd4=:0',
              ariaLabel: ''
            }
          ]
        },
      ],
      [
        {
          index: 0,
          title: '金泽',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 136.677719,
          latitude: 36.573028,
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-04-23-36(2).jpg?sign=p4IsoSXmH9b5O09DlLUbEiecup8oYWB6HfqHtOp68fE=:0',
              ariaLabel: ''
            }
          ]
        },
      ]
    ],
    transportations: [[]]
  },
  {
    id: 8,
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
    locations: [
      [
        {
          index: 0,
          title: 'さいたまスーパーアリーナ',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 139.630729,
          latitude: 35.895042, 
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-04-23-36(4).jpg?sign=A9iu2Pu4w9ntfw8qrpvFwLCaWfm8pRV70WM6Zy2ljaY=:0',
              ariaLabel: ''
            }
          ]
        },
      ]
    ],
    transportations: [[]]
  },
  {
    id: 9,
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
    nodeCopyNames: ['广州公演', '上海公演'],
    locations: [
      [
        {
          index: 0,
          title: '广州亚运城综合体育馆',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 113.480027,
          latitude: 22.941870, 
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-04-23-31.jpg?sign=iFy7cTnWjtMjh1hY1GRmLtlnGFNgpoen0A34WHRxQkQ=:0',
              ariaLabel: ''
            }
          ]
        },
      ],
      [
        {
          index: 0,
          title: '上海国家会展中心虹馆EH',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 121.302468,
          latitude: 31.189202, 
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2024-10-06-17-53(1).jpg?sign=DpWOquEwjUtWFPT_worI_6D7CKhvdAiUCb-7h65VI9M=:0',
              ariaLabel: ''
            }
          ]
        },
      ]
    ],
    transportations: [[]]
  },
  niji7th,
  {
    id: 11,
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
    locations: [
      [
        {
          index: 0,
          title: '横浜アリーナ',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 139.620147,
          latitude: 35.512202, 
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2025-01-10-15-46.jpg?sign=mmLIsLGRzUYX32RxFYyaAb7UWi9ktA5OyJB92msSmDs=:0',
              ariaLabel: ''
            }
          ]
        },
      ]
    ],
    transportations: [[]]
  },
  {
    id: 12,
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
    locations: [
      [
        {
          index: 0,
          title: 'K-Arena Yokohama',
          startOffset: 0,
          endOffset: 0,
          timeOffset: -540,
          longitude: 139.630450,
          latitude: 35.464577,
          photos: [
            {
              value: 'https://llsif.738ngx.site/d/%E7%BE%A4%E7%92%83%E5%A5%88%E8%B5%84%E6%BA%90/%E6%B4%BB%E5%8A%A8%E8%AE%B0%E5%BD%95/2025-02-01-15-11.jpg?sign=-kbzp5sRCReF60L9got7XzDvQGmCRDuCx_Cy_fF8HU4=:0',
              ariaLabel: ''
            }
          ]
        },
      ]
    ],
    transportations: [[]]
  },
]