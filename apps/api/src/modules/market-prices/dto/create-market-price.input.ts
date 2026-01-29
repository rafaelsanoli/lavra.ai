import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, Min, IsDateString, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class CreateMarketPriceInput {
  @Field()
  @IsString()
  @MaxLength(100)
  commodity: string;

  @Field()
  @IsString()
  @MaxLength(100)
  market: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field({ defaultValue: 'BRL' })
  @IsString()
  @MaxLength(10)
  currency: string;

  @Field({ defaultValue: 'kg' })
  @IsString()
  @MaxLength(20)
  unit: string;

  @Field()
  @IsDateString()
  timestamp: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;
}
