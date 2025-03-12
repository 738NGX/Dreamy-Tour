import DTO from "@/base/dto";
import { Readable } from "stream";

class PostPublishDto extends DTO<PostPublishDto> {
  // 用户 ID
  uid: number
  // 发帖者 IP
  ipAddress: string
  // 推送文件
  files: Buffer[] | Readable[]
  // 帖子标题
  title: string
  // 帖子正文
  content: string
  // 频道 ID
  channelId: number
}

export default PostPublishDto;