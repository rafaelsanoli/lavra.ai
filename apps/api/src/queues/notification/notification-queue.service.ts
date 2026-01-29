import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NOTIFICATION_QUEUE } from './notification-queue.module';

export interface SendNotificationJobData {
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  title: string;
  message: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private notificationQueue: Queue<SendNotificationJobData>,
  ) {}

  async addNotificationJob(
    data: SendNotificationJobData,
  ): Promise<void> {
    const priority = this.getPriorityValue(data.priority || 'normal');

    this.logger.log(
      `Adding notification job for user ${data.userId} (type: ${data.type}, priority: ${data.priority})`,
    );

    await this.notificationQueue.add('send-notification', data, {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addBulkNotifications(
    notifications: SendNotificationJobData[],
  ): Promise<void> {
    this.logger.log(`Adding bulk notifications: ${notifications.length}`);

    const jobs = notifications.map((notification) => ({
      name: 'send-notification',
      data: notification,
      opts: {
        priority: this.getPriorityValue(notification.priority || 'normal'),
        attempts: 3,
        backoff: {
          type: 'exponential' as const,
          delay: 1000,
        },
      },
    }));

    await this.notificationQueue.addBulk(jobs);
  }

  async scheduleNotification(
    data: SendNotificationJobData,
    delay: number, // milliseconds
  ): Promise<void> {
    this.logger.log(
      `Scheduling notification for user ${data.userId} with delay ${delay}ms`,
    );

    await this.notificationQueue.add('send-notification', data, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async getJobCounts(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const counts = await this.notificationQueue.getJobCounts();
    return counts;
  }

  async clearQueue(): Promise<void> {
    await this.notificationQueue.empty();
    this.logger.log('Notification queue cleared');
  }

  private getPriorityValue(priority: string): number {
    const priorityMap: Record<string, number> = {
      low: 10,
      normal: 5,
      high: 2,
      critical: 1,
    };
    return priorityMap[priority] || 5;
  }
}
