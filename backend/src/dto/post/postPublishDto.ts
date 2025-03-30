/*
 * 发布帖子需要上传的数据
 * @Author: Franctoryer 
 * @Date: 2025-03-23 15:28:40 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-23 20:44:08
 */
import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsInt, Length } from "class-validator";


class PostPublishDto extends DTO<PostPublishDto> {
  // 用户 ID
  @Expose()
  @IsInt({
    message: "用户 ID 必须是整数"
  })
  @Type(() => Number)
  uid: number

  // 发帖者 IP
  @Expose()
  @Type(() => String)
  ipAddress?: string

  // 帖子图片
  @Expose()
  pictures: string[]

  // 帖子标题
  @Expose()
  @Length(1, 50, {
    message: "标题长度必须在 $constraint1 到 $constraint2 个字符之间"
  })
  @Type(() => String)
  title: string

  // 帖子正文
  @Expose()
  @Length(1, 5000, {
    message: "正文长度必须在 $constraint1 到 $constraint2 个字符"
  })
  @Type(() => String)
  content: string

  // 频道 ID
  @Expose()
  @IsInt({
    message: "频道 ID 必须是整数"
  })
  @Type(() => Number)
  channelId: number
}

export default PostPublishDto;