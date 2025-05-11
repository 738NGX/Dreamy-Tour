/*
 * RabbitMQ 重试装饰器
 * @Author: Franctoryer 
 * @Date: 2025-05-11 19:43:41 
 * @Last Modified by: Franctoryer
 * @Last Modified time: 2025-05-11 19:48:54
 */
import { logger } from "@/config/loggerConfig";
import rabbitMQConfig from "@/config/rabbitMqConfig";
import { Channel, ConsumeMessage } from "amqplib";

export function RabbitRetry(maxRetryCount: number = 3) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (channel: Channel, msg: ConsumeMessage | null) {
      if (!msg) {
        logger.warn("Received null message");
        return;
      }

      try {
        await originalMethod.apply(this, [channel, msg]);
        // 确认消息
        channel.ack(msg, false);
      } catch (err: any) {
        const retryCount = msg.properties.headers?.["x-retry-count"] || 0;

        if (retryCount < maxRetryCount) {
          logger.warn(
            `Failed to consume msg in ${rabbitMQConfig.queues.emailCaptcha}: ${err}. retrying [${retryCount}]...`
          );
          channel.publish(
            rabbitMQConfig.retryExchange.name,
            msg.fields.routingKey,
            msg.content,
            {
              persistent: true,
              headers: {
                "x-retry-count": retryCount + 1,
              },
            }
          );
        } else {
          logger.error(
            `Failed to consume msg in ${rabbitMQConfig.queues.emailCaptcha}: ${err}. max retries`
          );
          channel.publish(
            rabbitMQConfig.failExchange.name,
            msg.fields.routingKey,
            msg.content,
            {
              persistent: true,
              headers: {
                "x-retry-count": retryCount,
              },
            }
          );
        }

        channel.ack(msg, false); // 标记消息处理完毕
      }
    };

    return descriptor;
  };
}
