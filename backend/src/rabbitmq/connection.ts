import { logger } from "@/config/loggerConfig";
import rabbitMQConfig from "@/config/rabbitMqConfig";
import * as amqp from "amqplib"

class RabbitMQConnection {
  // 连接对象
  private connection: amqp.ChannelModel | null = null;
  // 建立通道
  private channel: amqp.Channel | null = null;
  // 是否正在连接
  private isConnecting: boolean = false;

  /**
   * 建立连接
   */
  async connect(): Promise<void> {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.connection = await amqp.connect(rabbitMQConfig.url);
      this.channel = await this.connection.createChannel()

      // 配置交换机和队列
      await this.channel.assertExchange(rabbitMQConfig.exchange.name, rabbitMQConfig.exchange.type, {
        durable: true
      });
      for (const queue of Object.values(rabbitMQConfig.queues)) {
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, rabbitMQConfig.exchange.name, queue);
      }

      // 处理连接和通道错误
      this.connection.on('error', (err) => this.handleError(err));
      this.connection.on('close', () => this.reconnect());
      this.channel.on('error', (err) => this.handleError(err));
      this.channel.on('close', () => this.reconnect());
    } catch (err: any) {
      logger.error(`RabbitMq Error: ${err}`)
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * 重连
   * @returns 
   */
  private async reconnect(): Promise<void> {
    if (this.isConnecting) return;
    logger.warn(`RabbitMQ connection lost, reconnecting in ${rabbitMQConfig.retryDelay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, rabbitMQConfig.retryDelay));
    await this.connect();
  }

  /**
   * 处理异常
   * @param err 
   */
  private handleError(err: any): void {
    logger.error(`RabbitMQ error: ${err.message}`);
  }

  /**
   * 获取通道对象
   * @returns 
   */
  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    return this.channel;
  }

  /**
   * 关闭连接
   */
  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export const rabbitMQConnection = new RabbitMQConnection();