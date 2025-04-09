/*
 * SMTP 服务对象
 * @Author: Franctoryer 
 * @Date: 2025-04-08 23:35:06 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-04-09 00:18:28
 */
import EmailConstant from "@/constant/emailConstant";
import nodemailer from "nodemailer"

const emailServer = nodemailer.createTransport({
  service: "163",     // 网易邮箱
  auth: {
    user: EmailConstant.FROM_EMAIL,
    pass: EmailConstant.EMAIL_PASS // 授权码
  }
});

export default emailServer;