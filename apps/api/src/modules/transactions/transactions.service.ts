import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionInput, TransactionType } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionInput: CreateTransactionInput) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionInput,
        userId,
        executedAt: new Date(createTransactionInput.executedAt),
      },
    });
  }

  async findAll(
    userId: string,
    type?: TransactionType,
    commodity?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (commodity) {
      where.commodity = commodity;
    }

    if (startDate || endDate) {
      where.executedAt = {};
      if (startDate) {
        where.executedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.executedAt.lte = new Date(endDate);
      }
    }

    return this.prisma.transaction.findMany({
      where,
      orderBy: {
        executedAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async update(id: string, userId: string, updateTransactionInput: UpdateTransactionInput) {
    await this.findOne(id, userId);

    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionInput,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  /**
   * Calcula resumo de transações por tipo e commodity
   */
  async getSummary(userId: string, type?: TransactionType, commodity?: string) {
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (commodity) {
      where.commodity = commodity;
    }

    const transactions = await this.prisma.transaction.findMany({ where });

    // Agrupar por tipo e commodity
    const grouped = transactions.reduce((acc, t) => {
      const key = `${t.type}-${t.commodity}`;
      if (!acc[key]) {
        acc[key] = {
          type: t.type,
          commodity: t.commodity,
          totalQuantity: 0,
          totalValue: 0,
          count: 0,
          prices: [],
        };
      }
      acc[key].totalQuantity += Number(t.quantity);
      acc[key].totalValue += Number(t.totalValue);
      acc[key].count += 1;
      acc[key].prices.push(Number(t.price));
      return acc;
    }, {});

    return Object.values(grouped).map((g: any) => ({
      type: g.type,
      commodity: g.commodity,
      totalQuantity: g.totalQuantity,
      totalValue: g.totalValue,
      avgPrice: g.totalValue / g.totalQuantity,
      count: g.count,
    }));
  }

  /**
   * Calcula saldo por commodity (vendas - compras)
   */
  async getBalance(userId: string, commodity?: string) {
    const where: any = { userId };
    if (commodity) {
      where.commodity = commodity;
    }

    const transactions = await this.prisma.transaction.findMany({ where });

    const balances = transactions.reduce((acc, t) => {
      if (!acc[t.commodity]) {
        acc[t.commodity] = {
          commodity: t.commodity,
          purchases: 0,
          sales: 0,
          balance: 0,
        };
      }

      if (t.type === 'PURCHASE') {
        acc[t.commodity].purchases += Number(t.quantity);
      } else if (t.type === 'SALE') {
        acc[t.commodity].sales += Number(t.quantity);
      }

      acc[t.commodity].balance = acc[t.commodity].purchases - acc[t.commodity].sales;

      return acc;
    }, {});

    return Object.values(balances);
  }

  /**
   * Calcula P&L (lucro/prejuízo) por período
   */
  async getProfitLoss(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.executedAt = {};
      if (startDate) {
        where.executedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.executedAt.lte = new Date(endDate);
      }
    }

    const transactions = await this.prisma.transaction.findMany({ where });

    let totalRevenue = 0;
    let totalCost = 0;

    transactions.forEach((t) => {
      if (t.type === 'SALE') {
        totalRevenue += Number(t.totalValue);
      } else if (t.type === 'PURCHASE') {
        totalCost += Number(t.totalValue);
      }
    });

    return {
      totalRevenue,
      totalCost,
      profitLoss: totalRevenue - totalCost,
      margin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
    };
  }
}
