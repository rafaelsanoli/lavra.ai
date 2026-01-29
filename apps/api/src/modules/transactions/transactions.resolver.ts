import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSummary } from './entities/transaction.entity';
import { CreateTransactionInput, TransactionType } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => Transaction)
@UseGuards(GqlAuthGuard)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => Transaction)
  createTransaction(
    @CurrentUser('sub') userId: string,
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionsService.create(userId, createTransactionInput);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll(
    @CurrentUser('sub') userId: string,
    @Args('type', { type: () => TransactionType, nullable: true }) type?: TransactionType,
    @Args('commodity', { nullable: true }) commodity?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ) {
    return this.transactionsService.findAll(userId, type, commodity, startDate, endDate);
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  @Mutation(() => Transaction)
  updateTransaction(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
    @Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionsService.update(id, userId, updateTransactionInput);
  }

  @Mutation(() => Transaction)
  removeTransaction(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.transactionsService.remove(id, userId);
  }

  @Query(() => [TransactionSummary], { name: 'transactionsSummary' })
  getSummary(
    @CurrentUser('sub') userId: string,
    @Args('type', { type: () => TransactionType, nullable: true }) type?: TransactionType,
    @Args('commodity', { nullable: true }) commodity?: string,
  ) {
    return this.transactionsService.getSummary(userId, type, commodity);
  }
}
