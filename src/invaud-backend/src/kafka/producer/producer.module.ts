import { Module } from '@nestjs/common';
import { KafkaModule } from '../common/kafka.module';
import { ProducerService } from '../producer/producer.service';

const kafkaGroup = process.env.KAFKA_GROUP_ID || "cool-group";

@Module({
  imports: [
    KafkaModule.register([
      {
        name: 'Kafka_service',
        options: {
          client: {
            clientId: 'backend',
            brokers: ["kafka1:9092"]
          },
          consumer: {
            groupId: kafkaGroup
          }
        }
      }
    ]),],
  providers: [ProducerService],
  exports: [ProducerService]
})

export class ProducerModule { }