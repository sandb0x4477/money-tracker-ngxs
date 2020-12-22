import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { RepeatTransModule } from './repeat-trans/repeat-trans.module';
import { NotificationModule } from './notification/notification.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AccountModule,
    TransactionModule,
    CategoryModule,
    UserModule,
    RepeatTransModule,
    NotificationModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
