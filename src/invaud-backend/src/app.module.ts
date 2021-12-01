import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConsumerModule } from './kafka/consumer/consumer.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ConfigModule } from '@nestjs/config';
import { DataTransformerModule } from './data-transformer/data-transformer.module';
import { RulesEngineModule } from './rules-engine/rules-engine.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),
    ConsumerModule,
    AuthModule,
    UsersModule,
    DatabaseModule,
    InvoicesModule,
    DataTransformerModule,
    RulesEngineModule,
  ],
})
export class AppModule {}
