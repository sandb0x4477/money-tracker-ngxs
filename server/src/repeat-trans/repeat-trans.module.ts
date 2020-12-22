import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RepeatTransController } from './repeat-trans.controller';
import { RepeatTransService } from './repeat-trans.service';
import { RepeatTrans } from './repeat-trans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepeatTrans])],
  controllers: [RepeatTransController],
  providers: [RepeatTransService]
})
export class RepeatTransModule {}
