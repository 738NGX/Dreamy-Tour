import RoleConstant from "@/constant/RoleConstant";
import ParamsError from "@/exception/paramsError";

/*
 * 角色相关的工具类
 * @Author: Franctoryer 
 * @Date: 2025-03-23 19:11:43 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-03-23 19:30:15
 */
class RoleUtil {
  /**
   * 将角色字符串转成角色数字
   * @param roleString 角色字符串
   * @returns 角色数字
   */
  static roleStringToNumber(roleString: string): number {
    switch (roleString.toUpperCase()) {
      case "PASSENGER":
        return RoleConstant.PASSENGER;
      case "SAILOR":
        return RoleConstant.SAILOR;
      case "BOATSWAIN":
        return RoleConstant.BOATSWAIN;
      case "CHIEF_ENGINEER":
        return RoleConstant.CHIEF_ENGINEER;
      case "FIRST_MATE":
        return RoleConstant.FIRST_MATE;
      case "CAPTAIN":
        return RoleConstant.CAPTAIN;
      case "EXPLORER":
        return RoleConstant.EXPLORER;
      case "ADMIN":
        return RoleConstant.ADMIN;
      default:
        throw new ParamsError("未知角色类型");
    }
  }

  /**
   * 将角色数字变成角色字符串
   * @param roleId 角色数字
   * @returns 角色字符串
   */
  static roleNumberToString(roleId: number): string {
    switch (roleId) {
      case RoleConstant.PASSENGER:
        return "PASSENGER";
      case RoleConstant.SAILOR:
        return "SAILOR";
      case RoleConstant.BOATSWAIN:
        return "BOATSWAIN";
      case RoleConstant.CHIEF_ENGINEER:
        return "CHIEF_ENGINEER";
      case RoleConstant.FIRST_MATE:
        return "FIRST_MATE";
      case RoleConstant.CAPTAIN:
        return "CAPTAIN";
      case RoleConstant.EXPLORER:
        return "EXPLORER";
      case RoleConstant.ADMIN:
        return "ADMIN";
      default:
        throw new ParamsError("未知角色类型");
    }
}

}

export default RoleUtil;