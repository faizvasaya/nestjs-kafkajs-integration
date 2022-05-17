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
          key: 'HIGH_PRIORITY',
          value: 'Hello world from HIGH_PRIORITY partition',
        },
        {
          key: 'HIGH_PRIORITY',
          value: 'Hello world from HIGH_PRIORITY partition',
        },
        {
          key: 'HIGH_PRIORITY',
          value: 'Hello world from HIGH_PRIORITY partition',
        },
        {
          key: 'MEDIUM_PRIORITY',
          value: 'Hello world partition MEDIUM_PRIORITY partition',
        },
        {
          key: 'MEDIUM_PRIORITY',
          value: 'Hello world partition MEDIUM_PRIORITY partition',
        },
        {
          key: 'MEDIUM_PRIORITY',
          value: 'Hello world partition MEDIUM_PRIORITY partition',
        },
      ],
    });
  }
}
