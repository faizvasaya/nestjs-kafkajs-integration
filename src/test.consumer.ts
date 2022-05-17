import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    for (let i = 0; i < 3; i++) {
      await this.consumerService.consume(
        i,
        {
          topics: [this.configService.get<string>('KAFKA_TOPIC_NAME')],
        },
        {
          partitionsConsumedConcurrently: 2,
          eachMessage: async ({ topic, partition, message }) => {
            console.log({
              value: message.value.toString(),
              topic: topic.toString(),
              partition: partition.toString(),
            });
          },
        },
      );
    }
  }
}
