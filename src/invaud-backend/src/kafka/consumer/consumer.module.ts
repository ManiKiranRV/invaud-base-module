import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { KafkaModule } from '../common/kafka.module';
import { ConsumerService } from './consumer.service';
import { ProducerModule } from '../producer/producer.module';
import { InvoicesModule } from '../../invoices/invoices.module';
import { DataTransformerModule } from '../../data-transformer/data-transformer.module';
import { RulesEngineModule } from '../../rules-engine/rules-engine.module';
import { ForwarderConsumerService } from './forwarder-consumer/forwarder-consumer.service';
import { ShipperConsumerService } from './shipper-consumer/shipper-consumer.service';

const kafkaGroup = process.env.KAFKA_GROUP_ID || 'cool-group';

@Module({
  imports: [
    KafkaModule.register([
      {
        name: 'Kafka_service',
        options: {
          client: {
            clientId: 'backend',
            brokers: ['kafka1:9092'],
          },
          consumer: {
            groupId: kafkaGroup,
          },
        },
      },
    ]),
    DatabaseModule,
    ProducerModule,
    InvoicesModule,
    DataTransformerModule,
    RulesEngineModule,
  ],
  providers: [ConsumerService, ForwarderConsumerService, ShipperConsumerService],
})
export class ConsumerModule {}
