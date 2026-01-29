import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { TransactionType } from './dto/create-transaction.input';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  const mockUserId = 'user-123';
  const mockTransactionId = 'transaction-123';

  const mockTransaction = {
    id: mockTransactionId,
    userId: mockUserId,
    type: 'SALE',
    commodity: 'Soja',
    quantity: 30000,
    price: 150,
    totalValue: 4500000,
    executedAt: new Date('2026-01-15'),
    notes: 'Venda de safra',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput = {
      type: TransactionType.SALE,
      commodity: 'Soja',
      quantity: 30000,
      price: 150,
      totalValue: 4500000,
      executedAt: '2026-01-15T00:00:00.000Z',
      notes: 'Venda de safra',
    };

    it('deve criar uma transação com sucesso', async () => {
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue(mockTransaction as any);

      const result = await service.create(mockUserId, createInput);

      expect(result).toEqual(mockTransaction);
      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUserId,
          type: TransactionType.SALE,
          executedAt: expect.any(Date),
        }),
      });
    });

    it('deve calcular totalValue automaticamente', async () => {
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue(mockTransaction as any);

      await service.create(mockUserId, createInput);

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          totalValue: 4500000,
        }),
      });
    });
  });

  describe('findAll', () => {
    it('deve listar todas as transações do usuário', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([mockTransaction] as any);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([mockTransaction]);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { executedAt: 'desc' },
      });
    });

    it('deve filtrar por tipo', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([mockTransaction] as any);

      await service.findAll(mockUserId, TransactionType.SALE);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, type: TransactionType.SALE },
        orderBy: { executedAt: 'desc' },
      });
    });

    it('deve filtrar por commodity', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([mockTransaction] as any);

      await service.findAll(mockUserId, undefined, 'Soja');

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, commodity: 'Soja' },
        orderBy: { executedAt: 'desc' },
      });
    });

    it('deve filtrar por período', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([mockTransaction] as any);

      await service.findAll(mockUserId, undefined, undefined, '2026-01-01', '2026-01-31');

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          executedAt: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          },
        },
        orderBy: { executedAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma transação específica', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(mockTransaction as any);

      const result = await service.findOne(mockTransactionId, mockUserId);

      expect(result).toEqual(mockTransaction);
    });

    it('deve falhar se a transação não existir', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(mockTransactionId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateInput = {
      price: 160,
      totalValue: 4800000,
    };

    it('deve atualizar uma transação com sucesso', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(mockTransaction as any);
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue({
        ...mockTransaction,
        ...updateInput,
      } as any);

      const result = await service.update(mockTransactionId, mockUserId, updateInput);

      expect(result.price).toBe(160);
      expect(result.totalValue).toBe(4800000);
    });

    it('deve recalcular totalValue quando price é atualizado', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(mockTransaction as any);
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue({
        ...mockTransaction,
        price: 160,
        totalValue: 4800000,
      } as any);

      const result = await service.update(mockTransactionId, mockUserId, { price: 160 });

      expect(result.totalValue).toBe(4800000);
    });

    it('deve falhar se a transação não existir', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(null);

      await expect(
        service.update(mockTransactionId, mockUserId, updateInput),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma transação com sucesso', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(mockTransaction as any);
      jest.spyOn(prisma.transaction, 'delete').mockResolvedValue(mockTransaction as any);

      const result = await service.remove(mockTransactionId, mockUserId);

      expect(result).toEqual(mockTransaction);
    });

    it('deve falhar se a transação não existir', async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(mockTransactionId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSummary', () => {
    const mockTransactions = [
      { ...mockTransaction, type: 'SALE', commodity: 'Soja', quantity: 30000, price: 150, totalValue: 4500000 },
      { ...mockTransaction, type: 'SALE', commodity: 'Soja', quantity: 20000, price: 140, totalValue: 2800000 },
      { ...mockTransaction, type: 'PURCHASE', commodity: 'Milho', quantity: 10000, price: 80, totalValue: 800000 },
    ];

    it('deve agrupar transações por tipo e commodity', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(mockTransactions as any);

      const result = await service.getSummary(mockUserId);

      expect(result).toHaveLength(2); // SALE-Soja e PURCHASE-Milho
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('commodity');
      expect(result[0]).toHaveProperty('totalQuantity');
      expect(result[0]).toHaveProperty('totalValue');
      expect(result[0]).toHaveProperty('avgPrice');
      expect(result[0]).toHaveProperty('count');
    });

    it('deve calcular avgPrice corretamente', async () => {
      const sojaTransactions = mockTransactions.filter((t) => t.commodity === 'Soja');
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(sojaTransactions as any);

      const result = await service.getSummary(mockUserId, TransactionType.SALE, 'Soja');

      // (4500000 + 2800000) / (30000 + 20000) = 7300000 / 50000 = 146
      expect(result[0].avgPrice).toBe(146);
      expect(result[0].count).toBe(2);
    });

    it('deve filtrar por tipo', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(
        mockTransactions.filter((t) => t.type === 'SALE') as any,
      );

      const result = await service.getSummary(mockUserId, TransactionType.SALE);

      expect(result.every((r) => r.type === 'SALE')).toBe(true);
    });
  });

  describe('getBalance', () => {
    const mockTransactions = [
      { ...mockTransaction, type: 'PURCHASE', commodity: 'Soja', quantity: 50000 },
      { ...mockTransaction, type: 'SALE', commodity: 'Soja', quantity: 30000 },
      { ...mockTransaction, type: 'PURCHASE', commodity: 'Milho', quantity: 20000 },
      { ...mockTransaction, type: 'SALE', commodity: 'Milho', quantity: 15000 },
    ];

    it('deve calcular saldo de estoque corretamente', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(mockTransactions as any);

      const result = await service.getBalance(mockUserId);

      const sojaBalance = result.find((b: any) => b.commodity === 'Soja') as any;
      const milhoBalance = result.find((b: any) => b.commodity === 'Milho') as any;

      expect(sojaBalance.purchases).toBe(50000);
      expect(sojaBalance.sales).toBe(30000);
      expect(sojaBalance.balance).toBe(20000); // 50000 - 30000

      expect(milhoBalance.purchases).toBe(20000);
      expect(milhoBalance.sales).toBe(15000);
      expect(milhoBalance.balance).toBe(5000); // 20000 - 15000
    });

    it('deve filtrar por commodity', async () => {
      const sojaTransactions = mockTransactions.filter((t) => t.commodity === 'Soja');
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(sojaTransactions as any);

      const result = await service.getBalance(mockUserId, 'Soja') as any[];

      expect(result).toHaveLength(1);
      expect(result[0].commodity).toBe('Soja');
    });
  });

  describe('getProfitLoss', () => {
    const mockTransactions = [
      { ...mockTransaction, type: 'SALE', totalValue: 5000000 },
      { ...mockTransaction, type: 'SALE', totalValue: 3000000 },
      { ...mockTransaction, type: 'PURCHASE', totalValue: 4000000 },
      { ...mockTransaction, type: 'PURCHASE', totalValue: 2000000 },
    ];

    it('deve calcular P&L corretamente', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(mockTransactions as any);

      const result = await service.getProfitLoss(mockUserId);

      expect(result.totalRevenue).toBe(8000000); // 5M + 3M
      expect(result.totalCost).toBe(6000000); // 4M + 2M
      expect(result.profitLoss).toBe(2000000); // 8M - 6M
      expect(result.margin).toBe(25); // (2M / 8M) * 100 = 25%
    });

    it('deve calcular margem corretamente', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(mockTransactions as any);

      const result = await service.getProfitLoss(mockUserId);

      // Margem = ((receita - custo) / receita) * 100
      // (8000000 - 6000000) / 8000000 * 100 = 25%
      expect(result.margin).toBe(25);
    });

    it('deve filtrar por período', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(mockTransactions as any);

      await service.getProfitLoss(mockUserId, '2026-01-01', '2026-01-31');

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          executedAt: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          },
        },
      });
    });

    it('deve retornar margem 0 quando não há receita', async () => {
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);

      const result = await service.getProfitLoss(mockUserId);

      expect(result.totalRevenue).toBe(0);
      expect(result.totalCost).toBe(0);
      expect(result.profitLoss).toBe(0);
      expect(result.margin).toBe(0);
    });
  });
});
