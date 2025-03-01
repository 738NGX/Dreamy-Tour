import { Post } from "../../utils/channel/post";
import { postList, userList } from "../../utils/testData";
import { formatTime } from "../../utils/util";

Component({
  data: {
    currentPost: {} as Post,
    currentPhotoIndex: 0,
    imageProps: {
      mode: "widthFix",
    },
    maxHeight: 0,
    author: '',
    timeStr: '',
  },
  methods: {
    onLoad(options: any) {
      const { postId } = options;
      const currentPost = postList.find(post => post.id == postId);
      const author = userList.find(user => user.id == currentPost?.user)?.name;
      const timeStr = currentPost ? formatTime(currentPost.time) : '';
      this.setData({ 
        currentPost: currentPost,
        author: author,
        timeStr: timeStr,
      });
    },
    onImageLoad(e:any) {
      const { width, height } = e.detail;
      
      // 获取屏幕宽度，计算自适应后的高度
      wx.getSystemInfo({
        success: res => {
          const screenWidth = res.windowWidth;
          const newHeight = (height / width) * screenWidth; // 计算适配后高度
          this.setData({ maxHeight: Math.max(this.data.maxHeight, newHeight) });
        }
      });
    },
    onChildPageChange(e: any) {
      this.setData({ childPage: e.detail.value })
    },
  },
})