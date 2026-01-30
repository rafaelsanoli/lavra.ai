import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CepeaPriceDto {
  @Field()
  commodity: string; // SOJA, MILHO, CAFE, TRIGO, ALGODAO, BOI, etc

  @Field()
  market: string; // Ex: PARANAGUA, CAMPINAS, SANTOS

  @Field()
  date: Date;

  @Field(() => Float)
  price: number; // R$/saca ou R$/arroba

  @Field()
  unit: string; // saca, arroba, kg

  @Field(() => Float, { nullable: true })
  changePercent?: number;

  @Field(() => Float, { nullable: true })
  volumeNegotiated?: number;

  @Field({ nullable: true })
  priceType?: string; // SPOT, FUTURO, INDICADOR
}

@ObjectType()
export class CepeaHistoricalSeriesDto {
  @Field()
  commodity: string;

  @Field()
  market: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => [CepeaPriceDto])
  prices: CepeaPriceDto[];

  @Field(() => Float)
  averagePrice: number;

  @Field(() => Float)
  maxPrice: number;

  @Field(() => Float)
  minPrice: number;

  @Field(() => Float)
  volatility: number; // Desvio padrão
}

@ObjectType()
export class CepeaMarketIndicatorDto {
  @Field()
  commodity: string;

  @Field()
  date: Date;

  @Field(() => Float)
  spotPrice: number;

  @Field(() => Float, { nullable: true })
  futurePrice?: number;

  @Field(() => Float)
  basisPoints: number; // Diferença spot vs futuro

  @Field(() => Float)
  trend7days: number; // % variação 7 dias

  @Field(() => Float)
  trend30days: number; // % variação 30 dias

  @Field()
  sentiment: string; // BULLISH, BEARISH, NEUTRAL
}
