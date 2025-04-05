import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

class PageDto extends DTO<PageDto> {
  // 页数
  @Expose()
  @IsInt({
    message: "页数必须是整数"
  })
  @Min(1, {
    message: "页数不能小于 $constraint1"
  })
  @Type(() => Number)
  pageNum: number

  // 每页数量
  @Expose()
  @IsInt({
    message: "页数必须是整数"
  })
  @Min(1, {
    message: "每页数据量不能小于 $constraint1"
  })
  @Max(40, {
    message: "每页数据量不能超过 $constraint1"
  })
  @Type(() => Number)
  pageSize: number
}

export default PageDto;