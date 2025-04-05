/*
 * 发布评论需要的传参
 * @Author: Franctoryer 
 * @Date: 2025-04-05 19:37:57 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-05 19:42:54
 */
import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { ArrayMaxSize, Length } from "class-validator";

class CommentPublishDto extends DTO<CommentPublishDto> {
  // 帖子正文
  @Expose()
  @Length(1, 1000, {
    message: "帖子正文长度必须在 $constraint1 到 $constraint2 个字符之间"
  })
  @Type(() => String)
  content: string

  // 帖子图片
  @Expose()
  @ArrayMaxSize(8, {
    message: "评论最多上传 $constraint 张图片"
  })
  pictures: string[]
}

export default CommentPublishDto;