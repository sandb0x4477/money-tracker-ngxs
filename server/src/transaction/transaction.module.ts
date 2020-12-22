import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, NotificationEntity])],
  controllers: [TransactionController],
  providers: [TransactionService, NotificationService]
})
export class TransactionModule {}
