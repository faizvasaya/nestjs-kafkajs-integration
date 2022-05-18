import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from './kafka/consumer.service';
import { Utility } from './commons/utility';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    for (let i = 0; i < 10; i++) {
      await this.consumerService.consume(
        {
          topics: [this.configService.get<string>('KAFKA_TOPIC_NAME')],
        },
        {
          partitionsConsumedConcurrently: 1,
          eachMessage: async ({ topic, partition, message }) => {
            await Utility.sleep(5000);
            console.log(`------------------------`, {
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
