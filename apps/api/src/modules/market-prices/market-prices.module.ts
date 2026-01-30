import { Module, forwardRef } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';
import { MarketPricesResolver } from './market-prices.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { WebsocketsModule } from '../../websockets/websockets.module';

@Module({
  imports: [PrismaModule, forwardRef(() => WebsocketsModule)],
  providers: [MarketPricesResolver, MarketPricesService],
  exports: [MarketPricesService],
})
export class MarketPricesModule {}
