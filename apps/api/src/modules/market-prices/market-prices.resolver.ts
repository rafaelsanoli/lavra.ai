import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarketPricesService } from './market-prices.service';
import { MarketPrice, MarketPriceTrend, MarketPriceStatistics } from './entities/market-price.entity';
import { CreateMarketPriceInput } from './dto/create-market-price.input';
import { UpdateMarketPriceInput } from './dto/update-market-price.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => MarketPrice)
@UseGuards(JwtAuthGuard)
export class MarketPricesResolver {
  constructor(private readonly marketPricesService: MarketPricesService) {}

  @Mutation(() => MarketPrice)
  createMarketPrice(
    @Args('createMarketPriceInput') createMarketPriceInput: CreateMarketPriceInput,
  ) {
    return this.marketPricesService.create(createMarketPriceInput);
  }

  @Query(() => [MarketPrice], { name: 'marketPrices' })
  findAll(
    @Args('commodity', { nullable: true }) commodity?: string,
    @Args('market', { nullable: true }) market?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ) {
    return this.marketPricesService.findAll(commodity, market, startDate, endDate);
  }

  @Query(() => MarketPrice, { name: 'marketPrice' })
  findOne(@Args('id') id: string) {
    return this.marketPricesService.findOne(id);
  }

  @Mutation(() => MarketPrice)
  updateMarketPrice(
    @Args('id') id: string,
    @Args('updateMarketPriceInput') updateMarketPriceInput: UpdateMarketPriceInput,
  ) {
    return this.marketPricesService.update(id, updateMarketPriceInput);
  }

  @Mutation(() => MarketPrice)
  removeMarketPrice(@Args('id') id: string) {
    return this.marketPricesService.remove(id);
  }

  @Query(() => MarketPrice, { name: 'latestMarketPrice' })
  getLatestPrice(
    @Args('commodity') commodity: string,
    @Args('market', { nullable: true }) market?: string,
  ) {
    return this.marketPricesService.getLatestPrice(commodity, market);
  }

  @Query(() => MarketPriceTrend, { name: 'marketPriceTrend' })
  getPriceTrend(
    @Args('commodity') commodity: string,
    @Args('market', { nullable: true }) market?: string,
    @Args('days', { type: () => Int, defaultValue: 7 }) days?: number,
  ) {
    return this.marketPricesService.getPriceTrend(commodity, market, days);
  }

  @Query(() => MarketPriceStatistics, { name: 'marketPriceStatistics' })
  getPriceStatistics(
    @Args('commodity') commodity: string,
    @Args('market', { nullable: true }) market?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ) {
    return this.marketPricesService.getPriceStatistics(commodity, market, startDate, endDate);
  }

  @Query(() => [String], { name: 'availableCommodities' })
  getAvailableCommodities() {
    return this.marketPricesService.getAvailableCommodities();
  }
}
