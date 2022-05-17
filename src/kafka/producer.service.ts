import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CompressionTypes,
  Kafka,
  PartitionerArgs,
  Producer,
  ProducerRecord,
} from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  constructor(private configService: ConfigService) {}
  private readonly kafka = new Kafka({
    clientId: 'nestjs-kafkajs-integration',
    brokers: [this.configService.get<string>('KAFKA_BROKER_URL')],
  });

  private readonly producer: Producer = this.kafka.producer({
    createPartitioner: () => {
      return (args: PartitionerArgs) => {
        let partitionNumber = 0;
        if (args.message.key === 'HIGH_PRIORITY') {
          partitionNumber = this.getRandomNumberBetween(0, 1);
        } else if (args.message.key === 'MEDIUM_PRIORITY') {
          partitionNumber = 2;
        }
        return partitionNumber;
      };
    },
  });

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send({
      ...record,
      compression: CompressionTypes.GZIP,
    });
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  private getRandomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
