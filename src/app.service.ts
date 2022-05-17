import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(
    private producerService: ProducerService,
    private configService: ConfigService,
  ) {}
  async getHello() {
    await this.producerService.produce({
      topic: this.configService.get<string>('KAFKA_TOPIC_NAME'),
      messages: [
        {
          value: 'Hello world',
        },
      ],
    });
  }
}
