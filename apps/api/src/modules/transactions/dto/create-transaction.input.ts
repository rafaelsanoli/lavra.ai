import { InputType, Field, Float, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, IsNumber, Min, IsDateString, IsOptional, MaxLength } from 'class-validator';

export enum TransactionType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  HEDGE = 'HEDGE',
  OPTION = 'OPTION',
}

registerEnumType(TransactionType, { name: 'TransactionType' });

@InputType()
export class CreateTransactionInput {
  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field()
  @IsString()
  @MaxLength(100)
  commodity: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  totalValue: number;

  @Field()
  @IsDateString()
  executedAt: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
