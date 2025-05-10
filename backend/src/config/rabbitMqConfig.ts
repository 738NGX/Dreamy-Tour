/*
 * RabbitMQ 配置
 * @Author: Franctoryer 
 * @Date: 2025-05-05 23:11:49 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-05-05 23:14:53
 */

const rabbitMQConfig = {
  // 连接地址
  url: process.env.RABBITMQ_URL || 'amqp://admin:123456@localhost:5672',
  // 队列
  queues: {
    // 消息提醒
    notification: "notification_queue",
    // 邮箱验证码
    emailCaptcha: "email_captcha_queue",
    // 用户经验值
    userExp: "user_exp_queue"
  },
  // 交换机
  exchange: {
    name: "default",
    type: "direct"
  },
  // 重连延时
  retryDelay: 5000,
}

export default rabbitMQConfig;