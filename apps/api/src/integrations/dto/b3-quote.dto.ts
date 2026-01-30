import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class B3QuoteDto {
  @Field()
  symbol: string;

  @Field()
  name: string;

  @Field(() => Float)
  lastPrice: number;

  @Field(() => Float)
  changePercent: number;

  @Field(() => Float)
  volume: number;

  @Field(() => Float)
  high: number;

  @Field(() => Float)
  low: number;

  @Field(() => Float)
  open: number;

  @Field()
  timestamp: Date;

  @Field({ nullable: true })
  currency?: string;
}

@ObjectType()
export class B3FuturesDto {
  @Field()
  commodity: string; // SOJA, MILHO, CAFE, etc

  @Field()
  contract: string; // Ex: SOJK24 (K=mai, 24=2024)

  @Field()
  expirationDate: Date;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  changePercent: number;

  @Field(() => Float)
  volume: number;

  @Field(() => Float)
  openInterest: number;

  @Field()
  timestamp: Date;
}
