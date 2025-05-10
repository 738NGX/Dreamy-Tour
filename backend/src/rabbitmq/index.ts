import { logger } from "@/config/loggerConfig";
import { rabbitMQConnection } from "./connection";
import EmailConsumer from "./consumers/email";

async function startRabbitMQ(): Promise<void> {
  try {
    // 初始化 RabbitMQ 连接
    await rabbitMQConnection.connect();
    logger.info("[RabbitMQ] 成功初始化连接")
    // 注册消费者
    const consumers = [new EmailConsumer()]
    for (const consumer of consumers) {
      await consumer.start(rabbitMQConnection.getChannel());
    }
    logger.info("[RabbitMQ] 所有消费者已就绪，服务启动完成")
  } catch (err: any) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

export default startRabbitMQ;