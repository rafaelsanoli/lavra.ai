import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EventsGateway } from './events.gateway';

@WebSocketGateway({
  namespace: 'alerts',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class AlertsGateway {
  private readonly logger = new Logger(AlertsGateway.name);

  constructor(private readonly eventsGateway: EventsGateway) {}

  // Send new alert to specific user
  sendAlertToUser(userId: string, alert: any) {
    this.eventsGateway.emitToUser(userId, 'alert:new', {
      type: 'alert',
      data: alert,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Alert sent to user ${userId}: ${alert.title}`);
  }

  // Send alert update to specific user
  sendAlertUpdate(userId: string, alertId: string, updates: any) {
    this.eventsGateway.emitToUser(userId, 'alert:updated', {
      type: 'alert_update',
      alertId,
      data: updates,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Alert update sent to user ${userId}: ${alertId}`);
  }

  // Notify alert marked as read
  notifyAlertRead(userId: string, alertId: string) {
    this.eventsGateway.emitToUser(userId, 'alert:read', {
      type: 'alert_read',
      alertId,
      timestamp: new Date().toISOString(),
    });
  }

  // Notify alert resolved
  notifyAlertResolved(userId: string, alertId: string) {
    this.eventsGateway.emitToUser(userId, 'alert:resolved', {
      type: 'alert_resolved',
      alertId,
      timestamp: new Date().toISOString(),
    });
  }

  // Send weather alert to user
  sendWeatherAlert(userId: string, alert: any) {
    this.eventsGateway.emitToUser(userId, 'alert:weather', {
      type: 'weather_alert',
      data: alert,
      severity: alert.severity,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Weather alert sent to user ${userId}: ${alert.title}`);
  }

  // Send market alert to user
  sendMarketAlert(userId: string, alert: any) {
    this.eventsGateway.emitToUser(userId, 'alert:market', {
      type: 'market_alert',
      data: alert,
      severity: alert.severity,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Market alert sent to user ${userId}: ${alert.title}`);
  }

  // Subscribe to alerts
  @SubscribeMessage('alerts:subscribe')
  handleSubscribeAlerts(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`alerts:${data.userId}`);
    this.logger.log(`Client ${client.id} subscribed to alerts for user ${data.userId}`);
    return { success: true, message: 'Subscribed to alerts' };
  }

  // Unsubscribe from alerts
  @SubscribeMessage('alerts:unsubscribe')
  handleUnsubscribeAlerts(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`alerts:${data.userId}`);
    this.logger.log(`Client ${client.id} unsubscribed from alerts for user ${data.userId}`);
    return { success: true, message: 'Unsubscribed from alerts' };
  }

  // Get unread count
  @SubscribeMessage('alerts:getUnreadCount')
  handleGetUnreadCount(@MessageBody() data: { userId: string }) {
    // This would call AlertsService in real implementation
    return { success: true, count: 0 };
  }
}
