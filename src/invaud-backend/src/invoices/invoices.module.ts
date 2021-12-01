import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { DataTransformerModule } from '../data-transformer/data-transformer.module';
import { ProducerModule } from '../kafka/producer/producer.module';

@Module({
  imports: [DatabaseModule, DataTransformerModule, ProducerModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule {}
