import { logger } from "@/config/loggerConfig";
import { rabbitMQConnection } from "./connection";
import rabbitMQConfig from "@/config/rabbitMqConfig";

class RabbitMQProducer {
  async sendMessage(queue: string, message: any) {
    try {
      const channel = rabbitMQConnection.getChannel();
      const msgBuffer = Buffer.from(JSON.stringify(message));
      channel.publish(
        rabbitMQConfig.mainExchange.name, 
        queue, 
        msgBuffer, 
        { 
          persistent: true,
          headers: {
            "x-retry-count": 0  // 重试次数
          }
        }
      );
      logger.info(`Message sent to queue ${queue}: ${JSON.stringify(message)}`);
    } catch (err: any) {
      logger.error(`Failed to send message to ${queue}: ${err}`);
      throw err;
    }
  }
}

export const rabbitMQProducer = new RabbitMQProducer();