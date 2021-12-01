import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TokenService } from './token/token.service';

@Module({
  providers: [DatabaseService, TokenService],
  exports: [DatabaseService, TokenService]
})
export class DatabaseModule { }
