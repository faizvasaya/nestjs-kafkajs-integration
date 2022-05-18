import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from './kafka/producer.service';
import { Utility } from './commons/utility';

@Injectable()
export class AppService {
  constructor(
    private producerService: ProducerService,
    private configService: ConfigService,
  ) {}

  async getHello() {
    for (let i = 0; i < 10; i++) {
      await this.producerService.produce({
        topic: this.configService.get<string>('KAFKA_TOPIC_NAME'),
        messages: [
          {
            key: 'MEDIUM_PRIORITY',
            value: 'Hello world partition MEDIUM_PRIORITY partition',
          },
        ],
      });
    }
    await Utility.sleep(100);
    for (let i = 0; i < 20; i++) {
      await this.producerService.produce({
        topic: this.configService.get<string>('KAFKA_TOPIC_NAME'),
        messages: [
          {
            key: 'HIGH_PRIORITY',
            value: 'Hello world from HIGH_PRIORITY partition',
          },
        ],
      });
    }
    await Utility.sleep(500);
    for (let i = 0; i < 15; i++) {
      await this.producerService.produce({
        topic: this.configService.get<string>('KAFKA_TOPIC_NAME'),
        messages: [
          {
            key: 'LOW_PRIORITY',
            value: 'Hello world partition LOW_PRIORITY partition',
          },
        ],
      });
    }
  }
}
