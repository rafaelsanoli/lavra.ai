import { Module } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';
import { MarketPricesResolver } from './market-prices.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MarketPricesResolver, MarketPricesService],
  exports: [MarketPricesService],
})
export class MarketPricesModule {}
