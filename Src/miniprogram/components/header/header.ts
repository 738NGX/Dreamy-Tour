/**
 * 全局外部header容器
 */

const description = {
  ['频道']: '频道是为旅行者们搭建的稳定社交圈子，汇聚了拥有相同旅行兴趣的用户，提供日常交流、经验分享、旅行拼团和旅程规划建议等服务，让志同道合的伙伴共同探索精彩旅程。',

  ['加入方式']: '加入方式分为自由加入、需要审批、仅限邀请三种类型。自由加入类型允许用户直接申请并即时加入；需要审批类型需要用户提交申请并通过管理员审核才能加入；仅限邀请类型则不接受用户主动申请，仅通过管理员主动邀请加入。你也可以点击右下角的悬浮按钮创建一个全新的频道。',

  ['帖子列表']: '在这里你可以浏览频道内其他成员发布的所有讨论帖，点击帖子即可查看详细内容并参与互动。你还可以通过点击右下角的悬浮按钮，随时发布自己的讨论帖，分享旅行心得或提出你的问题。',

  ['群组']: '群组是频道中为具体某一次旅行活动而创建的专属组织形式，仅对频道成员开放查看和加入权限。每个群组都会关联特定的旅行行程，成员可以共同编辑和完善行程细节。旅行结束后，群组中的精彩瞬间和旅途信息会自动归档为频道足迹，永久保存在频道数据库供所有成员回顾。',
}

const helps = [
  {
    id: 0,
    childs: [
      { child: 0, title: '未知', value: '当前页面暂时没有帮助信息，请稍后再查看。' }
    ]
  },
  {
    id: 1,
    childs: [
      { child: 0, title: '频道列表', value: `${description['频道']}\n\n你可以在此页面查看你已加入的所有频道，点击频道标签即可进入频道详情界面，了解更多相关信息和动态。` },
      { child: 1, title: '添加频道', value: `${description['频道']}\n\n你可以在此页面发现你尚未加入的精彩频道，点击频道标签即可发起加入申请。\n\n${description['加入方式']}` }
    ]
  },
  {
    id: 2,
    childs: [
      { child: 0, title: '频道足迹', value: `${description['频道']}\n\n这里展示了频道成员们已完成的所有旅行足迹，你可以通过点击地图标记查看旅行者们留下的照片回忆，或者点击具体行程标签查看详细的旅行记录。` },
      { child: 1, title: '频道讨论', value: `${description['频道']}\n\n${description['帖子列表']}` },
      { child: 2, title: '频道群组', value: `${description['频道']}\n\n${description['群组']}\n\n你可以在此页面查看频道内所有已加入和未加入的群组，群组的${description['加入方式']}` },
      { child: 3, title: '频道选项', value: `${description['频道']}\n\n本页面展示频道的成员列表，频道管理员可以在这里编辑频道基础信息和设置权限，成员退出频道的操作也在此页面进行。` }
    ]
  },
  {
    id: 3,
    childs: [
      { child: 0, title: '讨论帖', value: '在此页面你可以查看讨论帖的详细内容，与其他旅行者互动交流，可以点赞、评论或回复帖子，积极参与到频道讨论中。' }
    ]
  },
  {
    id: 4,
    childs: [
      { child: 0, title: '群组详情', value: `${description['群组']}\n\n你可以在此页面查看群组成员列表、获取聊天群二维码以及查看和管理关联的行程信息。管理员也可在此页面编辑群组设置和成员权限，群组成员退出操作也在此完成。` }
    ]
  },
  {
    id: 5,
    childs: [
      { child: 0, title: '世界群组', value: `这里是世界频道，汇聚全球旅行者。\n\n${description['频道']}\n\n${description['群组']}\n\n你可以在这里探索并加入世界各地的群组，群组的${description['加入方式']}` }
    ]
  },
  {
    id: 6,
    childs: [
      { child: 0, title: '世界讨论', value: `欢迎来到世界频道，连接全球旅行者。\n\n${description['频道']}\n\n${description['帖子列表']}` }
    ]
  },
  {
    id: 7,
    childs: [
      { child: 0, title: '旅行消费统计', value: `你可以在本页面查看与行程相关的消费统计报表，包括详细的支出分类和统计数据，让你更好地管理旅途开销。` }
    ]
  },
  {
    id: 8,
    childs: [
      { child: 0, title: '行程编辑', value: `你可以在这里编辑并更新行程中的地点、交通工具、消费项目等细节信息，确保旅行计划更加完善清晰。` }
    ]
  },
  {
    id: 9,
    childs: [
      { child: 0, title: '行程查看', value: `你可以在这里查看已完成行程中涉及的地点、交通、预算等信息，为下一次行程的规划作参考。` }
    ]
  },
]


Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    tabList: {
      type: Array,
      value: []
    },
    helperId: {
      type: Number,
      value: 0
    }
  },
  data: {
    childPage: 0,
    helpVisible: false,
    helpTitle: helps[0].childs[0].title,
    helpText: helps[0].childs[0].value,
    confirmBtn: { content: '知道了', variant: 'base' },
  },
  methods: {
    onTabChange(e: { detail: { value: any; }; }) {
      const { value } = e.detail;
      this.setData({ childPage: value });
      this.triggerEvent('childPageChange', { value });
    },
    onBack() {
      wx.navigateBack();
    },
    handleHelp() {
      this.setData({
        helpVisible: !this.data.helpVisible,
        helpTitle: helps[this.properties.helperId].childs[this.data.childPage].title,
        helpText: helps[this.properties.helperId].childs[this.data.childPage].value,
      });
      //wx.showModal({
      //  title: helps[this.properties.helperId].childs[this.data.childPage].title,
      //  content: helps[this.properties.helperId].childs[this.data.childPage].value,
      //  showCancel: false,
      //  confirmText: '了解！',
      //})
    }
  }
});
