import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TransactionType } from '../dto/create-transaction.input';

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field()
  commodity: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  totalValue: number;

  @Field()
  executedAt: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class TransactionSummary {
  @Field(() => TransactionType)
  type: TransactionType;

  @Field()
  commodity: string;

  @Field(() => Float)
  totalQuantity: number;

  @Field(() => Float)
  totalValue: number;

  @Field(() => Float)
  avgPrice: number;

  @Field(() => Int)
  count: number;
}

import { Int } from '@nestjs/graphql';
