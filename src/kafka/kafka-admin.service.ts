import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Kafka } from 'kafkajs';

@Injectable()
export class KafkaAdminService implements OnModuleInit, OnApplicationShutdown {
  constructor(private configService: ConfigService) {}
  private readonly kafka = new Kafka({
    clientId: 'nestjs-kafkajs-integration',
    brokers: [this.configService.get<string>('KAFKA_BROKER_URL')],
    connectionTimeout: 3000,
  });
  private readonly admin: Admin = this.kafka.admin();

  async onModuleInit() {
    await this.admin.connect();
    const topics = await this.admin.listTopics();
    if (!topics.includes(this.configService.get<string>('KAFKA_TOPIC_NAME'))) {
      await this.admin.createTopics({
        topics: [
          {
            topic: this.configService.get<string>('KAFKA_TOPIC_NAME'),
            numPartitions: 10,
            replicationFactor: 1,
          },
        ],
      });
    }
  }
  async onApplicationShutdown() {
    await this.admin.disconnect();
  }
}
