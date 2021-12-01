import { Module } from '@nestjs/common';
import { DataTransformerService } from './data-transformer.service';

@Module({
  providers: [DataTransformerService],
  exports: [DataTransformerService],
})
export class DataTransformerModule {}
