import { logger } from "@/config/loggerConfig";
import { rabbitMQConnection } from "./connection";
import EmailConsumer from "./consumers/email";

async function startRabbitMQ(): Promise<void> {
  try {
    // 初始化 RabbitMQ 连接
    await rabbitMQConnection.connect();
    // 注册消费者
    const consumers = [new EmailConsumer()]
    for (const consumer of consumers) {
      await consumer.start(rabbitMQConnection.getChannel());
    }
  } catch (err: any) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

export default startRabbitMQ;