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

      // 主交换机
      await this.channel.assertExchange(rabbitMQConfig.mainExchange.name, rabbitMQConfig.mainExchange.type, {
        durable: true,
      });

      // 重试交换机
      await this.channel.assertExchange(rabbitMQConfig.retryExchange.name, rabbitMQConfig.retryExchange.type, {
        durable: true
      })

      // 失败交换机
      await this.channel.assertExchange(rabbitMQConfig.failExchange.name, rabbitMQConfig.failExchange.type, {
        durable: true
      })

      // 配置队列
      for (const queue of Object.values(rabbitMQConfig.queues)) {
        await this.channel.assertQueue(queue, { 
          durable: true,
          deadLetterExchange: rabbitMQConfig.retryExchange.name
        });
        await this.channel.bindQueue(queue, rabbitMQConfig.mainExchange.name, queue);
      }

      // 重试队列[延时队列]（5s 后重试）
      await this.channel.assertQueue(rabbitMQConfig.retryQueue.name, {
        durable: true,
        deadLetterExchange: rabbitMQConfig.mainExchange.name,
        messageTtl: rabbitMQConfig.retryQueue.messageTtl
      });
      await this.channel.bindQueue(
        rabbitMQConfig.retryQueue.name,
        rabbitMQConfig.retryExchange.name,
        "#"   // 接受所有队列的失败消息的转发
      );

      // 失败队列
      await this.channel.assertQueue(rabbitMQConfig.failQueue.name, {
        durable: true
      });
      await this.channel.bindQueue(
        rabbitMQConfig.failQueue.name, 
        rabbitMQConfig.failExchange.name,
        "#" // 接受所有队列的失败消息的转发
      )

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