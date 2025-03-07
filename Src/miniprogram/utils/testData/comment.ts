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
    id: 6,
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