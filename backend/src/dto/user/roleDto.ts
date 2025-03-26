import DTO from "@/base/dto";
import { Expose, Type } from "class-transformer";

class RoleDto extends DTO<RoleDto> {
  // 角色类型
  @Expose()
  @Type(() => String)
  role: string
}

export default RoleDto;