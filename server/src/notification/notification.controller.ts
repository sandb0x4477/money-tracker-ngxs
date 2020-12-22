import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { Request } from 'express';

import { NotificationService } from './notification.service';
import { User } from '../user/user.decorator';
import { AuthGuard } from '../shared/auth.guard';
import { UserEntity } from '../user/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // @Get()
  // // @UseGuards(AuthGuard)
  // getAll(): Promise<NotificationEntity[]> {
  //   return this.notificationService.getAll();
  // }

  @Post('subscribe')
  @UseGuards(AuthGuard)
  postSubscribe(@User() user: UserEntity, @Req() request: Request): any {
    return this.notificationService.postSubscribe(user, request);
  }
}
