import { logger } from "@/config/loggerConfig";
import { Channel, ConsumeMessage } from "amqplib";

abstract class RabbitMQConsumer {
  protected queue: string;

  constructor(queue: string) {
    this.queue = queue;
  }

  async start(channel: Channel): Promise<void> {
    await channel.consume(this.queue, (msg) => this.handleMessage(channel, msg), { noAck: false });
    logger.info(`[RabbitMQ] Consumer started for queue: ${this.queue}`);
  }

  protected abstract handleMessage(channel: Channel, msg: ConsumeMessage | null): Promise<void>;
}

export default RabbitMQConsumer;