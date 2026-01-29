import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, Min, IsOptional } from 'class-validator';

@InputType()
export class UpdateMarketPriceInput {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
