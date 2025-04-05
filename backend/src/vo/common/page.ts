/*
 * 分页数据封装
 * @Author: Franctoryer 
 * @Date: 2025-04-05 21:07:35 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-05 21:11:43
 */
import VO from "@/base/vo";

class Page<T> extends VO<Page<T>> {
  // 总数据量
  total: number
  // 当前页数
  currentPage: number
  // 分页数据
  records: T[]
}

export default Page;