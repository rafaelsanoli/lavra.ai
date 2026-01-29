import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, Min, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateTransactionInput {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalValue?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
