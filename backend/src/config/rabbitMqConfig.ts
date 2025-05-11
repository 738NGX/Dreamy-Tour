/*
 * RabbitMQ 配置
 * @Author: Franctoryer 
 * @Date: 2025-05-05 23:11:49 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-05-05 23:14:53
 */

const rabbitMQConfig = {
  // 连接地址
  url: `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASSWORD || '123456'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || '5672'}`,
  // 队列
  queues: {
    // 消息提醒
    notification: "notification_queue",
    // 邮箱验证码
    emailCaptcha: "email_captcha_queue",
    // 用户经验值
    userExp: "user_exp_queue"
  },
  // 重试队列
  retryQueue: {
    name: "retry_queue",
    messageTtl: 5000, // 延迟 5s 发给死信交换机
  },
  // 失败队列
  failQueue: {
    name: "fail_queue"
  },
  // 交换机
  mainExchange: {
    name: "default_exchange",
    type: "direct"
  },
  // 重试交换机
  retryExchange: {
    name: "retry_exchange",
    type: "topic"
  },
  // 失败交换机
  failExchange: {
    name: "fail_exchange",
    type: "topic"
  },
  // 重连延时
  retryDelay: 5000,
  // 自定义重试请求头
  retryHeader: "x-retry-header",
}

export default rabbitMQConfig;