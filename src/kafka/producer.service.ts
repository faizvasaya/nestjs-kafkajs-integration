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

  private highPriorityPartitions = [0, 1, 2, 3, 4, 5, 6];
  private highPriorityPartitionIndex = 0;

  private mediumPriorityPartitions = [7, 8];
  private mediumPriorityPartitionIndex = 0;

  private readonly producer: Producer = this.kafka.producer({
    createPartitioner: () => {
      return (args: PartitionerArgs) => {
        let partitionNumber = 0;
        if (args.message.key === 'HIGH_PRIORITY') {
          partitionNumber = this.getNextHighPartition();
        } else if (args.message.key === 'MEDIUM_PRIORITY') {
          partitionNumber = this.getNextMediumPartition();
        } else if (args.message.key === 'LOW_PRIORITY') {
          partitionNumber = 9;
        }

        return partitionNumber;
      };
    },
  });

  getNextHighPartition(): number {
    if (
      this.highPriorityPartitionIndex ===
      this.highPriorityPartitions.length - 1
    ) {
      this.highPriorityPartitionIndex = -1;
    }
    ++this.highPriorityPartitionIndex;
    return this.highPriorityPartitions[this.highPriorityPartitionIndex];
  }

  getNextMediumPartition(): number {
    if (
      this.mediumPriorityPartitionIndex ===
      this.mediumPriorityPartitions.length - 1
    ) {
      this.mediumPriorityPartitionIndex = -1;
    }
    ++this.mediumPriorityPartitionIndex;
    return this.mediumPriorityPartitions[this.mediumPriorityPartitionIndex];
  }

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
