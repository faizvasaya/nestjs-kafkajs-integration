import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
  AssignerProtocol,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  constructor(private configService: ConfigService) {}
  private readonly kafka = new Kafka({
    clientId: 'nestjs-kafkajs-integration',
    brokers: [this.configService.get<string>('KAFKA_BROKER_URL')],
    connectionTimeout: 3000,
  });

  private readonly consumers: Consumer[] = [];

  async consume(
    consumerIndex: number,
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ) {
    const consumer = this.kafka.consumer({
      groupId: this.configService.get<string>('KAFKA_GROUP_ID'),
      partitionAssigners: [
        ({ cluster, groupId, logger }) => ({
          name: 'custom-priority-consumer-assigner',
          version: 1,
          assign: async ({ members, topics }) => {
            return members.map(
              ({ memberId, memberMetadata }, index: number) => {
                return {
                  memberId,
                  memberAssignment: AssignerProtocol.MemberAssignment.encode({
                    version: 1,
                    assignment: {
                      [this.configService.get<string>('KAFKA_TOPIC_NAME')]: [
                        index,
                      ],
                    },
                    userData: undefined,
                  }),
                };
              },
            );
          },
          protocol: ({ topics }) => {
            return {
              name: 'custom-priority-consumer-assigner',
              metadata: AssignerProtocol.MemberMetadata.encode({
                topics,
                version: 1,
                userData: undefined,
              }),
            };
          },
        }),
      ],
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
