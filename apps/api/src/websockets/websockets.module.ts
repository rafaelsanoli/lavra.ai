import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AlertsGateway } from './alerts.gateway';
import { PricesGateway } from './prices.gateway';

@Module({
  providers: [EventsGateway, AlertsGateway, PricesGateway],
  exports: [EventsGateway, AlertsGateway, PricesGateway],
})
export class WebsocketsModule {}
