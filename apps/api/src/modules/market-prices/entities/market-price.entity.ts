import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class MarketPrice {
  @Field(() => ID)
  id: string;

  @Field()
  commodity: string;

  @Field()
  market: string;

  @Field(() => Float)
  price: number;

  @Field()
  currency: string;

  @Field()
  unit: string;

  @Field()
  timestamp: Date;

  @Field({ nullable: true })
  source?: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class MarketPriceTrend {
  @Field()
  commodity: string;

  @Field(() => Float)
  currentPrice: number;

  @Field(() => Float)
  previousPrice: number;

  @Field(() => Float)
  changePercent: number;

  @Field()
  trend: string; // 'UP', 'DOWN', 'STABLE'
}

@ObjectType()
export class MarketPriceStatistics {
  @Field()
  commodity: string;

  @Field(() => Float)
  minPrice: number;

  @Field(() => Float)
  maxPrice: number;

  @Field(() => Float)
  avgPrice: number;

  @Field(() => Int)
  count: number;
}

import { Int } from '@nestjs/graphql';
