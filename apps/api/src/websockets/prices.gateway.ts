import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EventsGateway } from './events.gateway';

@WebSocketGateway({
  namespace: 'prices',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class PricesGateway {
  private readonly logger = new Logger(PricesGateway.name);
  private commoditySubscriptions = new Map<string, Set<string>>(); // commodity -> Set<socketId>

  constructor(private readonly eventsGateway: EventsGateway) {}

  // Send price update to subscribers
  sendPriceUpdate(commodity: string, priceData: any) {
    const subscribers = this.commoditySubscriptions.get(commodity);
    
    if (subscribers && subscribers.size > 0) {
      this.eventsGateway.emitToRoom(`commodity:${commodity}`, 'price:update', {
        type: 'price_update',
        commodity,
        data: priceData,
        timestamp: new Date().toISOString(),
      });
      
      this.logger.log(
        `Price update sent for ${commodity} to ${subscribers.size} subscribers`,
      );
    }
  }

  // Send price alert (significant change)
  sendPriceAlert(commodity: string, alertData: any) {
    this.eventsGateway.emitToRoom(`commodity:${commodity}`, 'price:alert', {
      type: 'price_alert',
      commodity,
      data: alertData,
      timestamp: new Date().toISOString(),
    });
    
    this.logger.log(`Price alert sent for ${commodity}`);
  }

  // Broadcast market summary
  broadcastMarketSummary(summary: any) {
    this.eventsGateway.emitToAll('market:summary', {
      type: 'market_summary',
      data: summary,
      timestamp: new Date().toISOString(),
    });
    
    this.logger.log('Market summary broadcasted to all clients');
  }

  // Subscribe to commodity price updates
  @SubscribeMessage('prices:subscribe')
  handleSubscribePrices(
    @MessageBody() data: { commodity: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { commodity } = data;
    
    // Add client to room
    client.join(`commodity:${commodity}`);
    
    // Track subscription
    if (!this.commoditySubscriptions.has(commodity)) {
      this.commoditySubscriptions.set(commodity, new Set());
    }
    this.commoditySubscriptions.get(commodity)!.add(client.id);
    
    this.logger.log(
      `Client ${client.id} subscribed to ${commodity} prices`,
    );
    
    return {
      success: true,
      message: `Subscribed to ${commodity} prices`,
      commodity,
    };
  }

  // Unsubscribe from commodity price updates
  @SubscribeMessage('prices:unsubscribe')
  handleUnsubscribePrices(
    @MessageBody() data: { commodity: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { commodity } = data;
    
    // Remove client from room
    client.leave(`commodity:${commodity}`);
    
    // Remove from tracking
    const subscribers = this.commoditySubscriptions.get(commodity);
    if (subscribers) {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.commoditySubscriptions.delete(commodity);
      }
    }
    
    this.logger.log(
      `Client ${client.id} unsubscribed from ${commodity} prices`,
    );
    
    return {
      success: true,
      message: `Unsubscribed from ${commodity} prices`,
      commodity,
    };
  }

  // Subscribe to all commodities
  @SubscribeMessage('prices:subscribeAll')
  handleSubscribeAllPrices(@ConnectedSocket() client: Socket) {
    const commodities = ['soja', 'milho', 'cafe', 'trigo', 'algodao'];
    
    commodities.forEach((commodity) => {
      client.join(`commodity:${commodity}`);
      
      if (!this.commoditySubscriptions.has(commodity)) {
        this.commoditySubscriptions.set(commodity, new Set());
      }
      this.commoditySubscriptions.get(commodity)!.add(client.id);
    });
    
    this.logger.log(`Client ${client.id} subscribed to all commodity prices`);
    
    return {
      success: true,
      message: 'Subscribed to all commodity prices',
      commodities,
    };
  }

  // Get current subscribers count for a commodity
  @SubscribeMessage('prices:getSubscribersCount')
  handleGetSubscribersCount(@MessageBody() data: { commodity: string }) {
    const subscribers = this.commoditySubscriptions.get(data.commodity);
    const count = subscribers ? subscribers.size : 0;
    
    return {
      success: true,
      commodity: data.commodity,
      count,
    };
  }

  // Clean up subscriptions on disconnect
  handleClientDisconnect(clientId: string) {
    this.commoditySubscriptions.forEach((subscribers, commodity) => {
      if (subscribers.has(clientId)) {
        subscribers.delete(clientId);
        if (subscribers.size === 0) {
          this.commoditySubscriptions.delete(commodity);
        }
      }
    });
  }
}
