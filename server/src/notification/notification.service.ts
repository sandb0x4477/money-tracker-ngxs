import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import * as webPush from 'web-push';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
  ) {
    this.setupWebPush();
  }

  // async getAll(): Promise<NotificationEntity[]> {
  //   const notifications = await this.notificationRepo.find();
  //   return notifications;
  // }

  async create(user: any, subscription: any): Promise<NotificationEntity | HttpException> {
    console.log('TC: NotificationService -> payload', user, subscription);
    const payload: Partial<NotificationEntity> = {
      userId: user.id,
      username: user.username,
      subscription: JSON.stringify(subscription),
    };
    const notification = this.notificationRepo.create(payload);
    await this.notificationRepo.save(notification);
    return notification;
  }

  async delete(user: any, subscription: webPush.PushSubscription): Promise<DeleteResult> {
    const notification = await this.notificationRepo.findOne({
      where: {
        subscription,
      },
    });
    if (!notification) {
      throw new NotFoundException(`Subscription not found`);
    }
    const result = await this.notificationRepo.delete(notification);
    return result;
  }

  async postSubscribe(user: UserEntity, request: Request): Promise<any> {
    if (request.body && request.body.subscription) {
      if (request.body.action === 'subscribe') {
        await this.create(user, request.body.subscription);
      } else if (request.body.action === 'unsubscribe') {
        await this.delete(user, request.body.subscription);
      }
    }
  }

  async pushNotificationToSubscribers(user: any, payload: any) {
    // console.log('TC: NotificationService -> pushNotificationToSubscribers -> user', user);
    // console.log('TC: NotificationService -> pushNotificationToSubscribers -> payload', payload);
    const subscribers = await this.notificationRepo.find();
    if (!subscribers) {
      return;
    }

    const type = payload.type === 1 ? 'Expense' : 'Income';
    const catFullName = payload.subCategory
      ? `${payload.category.name}/${payload.subCategory.name}`
      : `${payload.category.name}`;

    const tempPayload = JSON.stringify({
      notification: {
        title: `New ${type} by ${user.username}`,
        body: `$${payload.amount} in ${catFullName} 🛒`,
        vibrate: [100, 50, 100],
        icon: 'assets/icons/icon-96x96.png',
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      },
    });

    subscribers.forEach(sub => {
      this.sendNotification(JSON.parse(sub.subscription), tempPayload);
    });
  }

  async sendNotification(subscription: webPush.PushSubscription, data: any): Promise<any> {
    await webPush.sendNotification(subscription, data).catch(error => {
      console.error(error);
    });
  }

  setupWebPush(): void {
    webPush.setVapidDetails(
      'mailto:my_email@my_domain.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }
}
