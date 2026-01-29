import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsService } from './simulations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  SimulationType,
  SimulationStatus,
} from './entities/simulation.entity';

describe('SimulationsService', () => {
  let service: SimulationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    simulation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUserId = 'user-123';
  const mockFarmId = 'farm-456';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SimulationsService>(SimulationsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new simulation with DRAFT status', async () => {
      const input = {
        name: 'Hedge Simulation',
        description: 'Test hedge strategy',
        type: SimulationType.HEDGE,
        parameters: {
          exposureAmount: 1000000,
          currentPrice: 150,
          targetPrice: 140,
        },
        farmId: mockFarmId,
      };

      const expected = {
        id: 'sim-1',
        ...input,
        userId: mockUserId,
        status: SimulationStatus.DRAFT,
        scenarios: null,
        results: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.simulation.create.mockResolvedValue(expected);

      const result = await service.create(mockUserId, input);

      expect(result).toEqual(expected);
      expect(prisma.simulation.create).toHaveBeenCalledWith({
        data: {
          ...input,
          userId: mockUserId,
          status: SimulationStatus.DRAFT,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all simulations for user', async () => {
      const simulations = [
        {
          id: 'sim-1',
          name: 'Hedge Sim',
          type: SimulationType.HEDGE,
          status: SimulationStatus.COMPLETED,
          userId: mockUserId,
          farmId: mockFarmId,
        },
        {
          id: 'sim-2',
          name: 'Production Sim',
          type: SimulationType.PRODUCTION,
          status: SimulationStatus.DRAFT,
          userId: mockUserId,
          farmId: mockFarmId,
        },
      ];

      mockPrismaService.simulation.findMany.mockResolvedValue(simulations);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual(simulations);
      expect(prisma.simulation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by type', async () => {
      mockPrismaService.simulation.findMany.mockResolvedValue([]);

      await service.findAll(mockUserId, SimulationType.HEDGE);

      expect(prisma.simulation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, type: SimulationType.HEDGE },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      mockPrismaService.simulation.findMany.mockResolvedValue([]);

      await service.findAll(
        mockUserId,
        undefined,
        SimulationStatus.COMPLETED,
      );

      expect(prisma.simulation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: SimulationStatus.COMPLETED },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by farmId', async () => {
      mockPrismaService.simulation.findMany.mockResolvedValue([]);

      await service.findAll(mockUserId, undefined, undefined, mockFarmId);

      expect(prisma.simulation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, farmId: mockFarmId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a simulation by id', async () => {
      const simulation = {
        id: 'sim-1',
        name: 'Test Sim',
        userId: mockUserId,
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.findOne(mockUserId, 'sim-1');

      expect(result).toEqual(simulation);
    });

    it('should throw NotFoundException if simulation not found', async () => {
      mockPrismaService.simulation.findFirst.mockResolvedValue(null);

      await expect(service.findOne(mockUserId, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a simulation', async () => {
      const existing = {
        id: 'sim-1',
        name: 'Old Name',
        userId: mockUserId,
      };

      const updateInput = {
        name: 'New Name',
        description: 'Updated description',
      };

      const updated = { ...existing, ...updateInput };

      mockPrismaService.simulation.findFirst.mockResolvedValue(existing);
      mockPrismaService.simulation.update.mockResolvedValue(updated);

      const result = await service.update(mockUserId, 'sim-1', updateInput);

      expect(result).toEqual(updated);
      expect(prisma.simulation.update).toHaveBeenCalledWith({
        where: { id: 'sim-1' },
        data: updateInput,
      });
    });

    it('should throw NotFoundException if simulation not found', async () => {
      mockPrismaService.simulation.findFirst.mockResolvedValue(null);

      await expect(
        service.update(mockUserId, 'invalid-id', { name: 'New' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a simulation', async () => {
      const simulation = { id: 'sim-1', userId: mockUserId };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);
      mockPrismaService.simulation.delete.mockResolvedValue(simulation);

      const result = await service.remove(mockUserId, 'sim-1');

      expect(result).toEqual(simulation);
      expect(prisma.simulation.delete).toHaveBeenCalledWith({
        where: { id: 'sim-1' },
      });
    });
  });

  describe('runSimulation', () => {
    it('should execute simulation and return results', async () => {
      const simulation = {
        id: 'sim-1',
        name: 'Production Sim',
        type: SimulationType.PRODUCTION,
        userId: mockUserId,
        farmId: mockFarmId,
        status: SimulationStatus.DRAFT,
        parameters: {
          expectedRevenue: 500000,
          expectedCosts: 300000,
        },
        scenarios: [
          { name: 'Low Yield', yieldMultiplier: 0.8 },
          { name: 'Expected Yield', yieldMultiplier: 1.0 },
          { name: 'High Yield', yieldMultiplier: 1.2 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);
      mockPrismaService.simulation.update.mockResolvedValue({
        ...simulation,
        status: SimulationStatus.COMPLETED,
      });

      const result = await service.runSimulation(mockUserId, 'sim-1');

      expect(result.simulationId).toBe('sim-1');
      expect(result.scenarios).toHaveLength(3);
      expect(result.bestScenario).toBeDefined();
      expect(result.worstScenario).toBeDefined();
      expect(result.statistics).toBeDefined();
      expect(result.statistics.scenarioCount).toBe(3);

      // Verify status updated to RUNNING then COMPLETED
      expect(prisma.simulation.update).toHaveBeenCalledWith({
        where: { id: 'sim-1' },
        data: { status: SimulationStatus.RUNNING },
      });

      expect(prisma.simulation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'sim-1' },
          data: expect.objectContaining({
            status: SimulationStatus.COMPLETED,
          }),
        }),
      );
    });

    it('should mark simulation as FAILED on error', async () => {
      const simulation = {
        id: 'sim-1',
        type: SimulationType.HEDGE,
        userId: mockUserId,
        parameters: {},
        scenarios: null,
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);
      mockPrismaService.simulation.update
        .mockResolvedValueOnce({}) // RUNNING
        .mockRejectedValueOnce(new Error('Calculation error'));

      await expect(
        service.runSimulation(mockUserId, 'sim-1'),
      ).rejects.toThrow();

      // Should have tried to mark as FAILED
      expect(prisma.simulation.update).toHaveBeenCalledWith({
        where: { id: 'sim-1' },
        data: { status: SimulationStatus.FAILED },
      });
    });
  });

  describe('calculateBreakeven', () => {
    it('should calculate breakeven price and quantity', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          fixedCosts: 100000,
          variableCostPerUnit: 80,
          pricePerUnit: 120,
          expectedQuantity: 5000,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.calculateBreakeven(mockUserId, 'sim-1');

      expect(result.simulationId).toBe('sim-1');
      expect(result.totalFixedCosts).toBe(100000);
      expect(result.totalVariableCosts).toBe(400000); // 80 * 5000
      expect(result.breakevenQuantity).toBe(2500); // 100000 / (120 - 80)
      expect(result.breakevenPrice).toBe(100); // (100000 / 5000) + 80
      expect(result.analysis.contributionMargin).toBe(40);
      expect(result.analysis.contributionMarginRatio).toBeCloseTo(33.33, 1);
    });

    it('should handle zero price edge case', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          fixedCosts: 50000,
          variableCostPerUnit: 100,
          pricePerUnit: 100, // Price equals variable cost
          expectedQuantity: 1000,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.calculateBreakeven(mockUserId, 'sim-1');

      expect(result.breakevenQuantity).toBe(0); // Cannot break even
      expect(result.analysis.contributionMargin).toBe(0);
    });
  });

  describe('calculateROI', () => {
    it('should calculate ROI and payback period', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          totalInvestment: 500000,
          expectedRevenue: 800000,
          expectedCosts: 300000,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.calculateROI(mockUserId, 'sim-1');

      expect(result.simulationId).toBe('sim-1');
      expect(result.totalInvestment).toBe(500000);
      expect(result.expectedReturn).toBe(500000); // 800000 - 300000
      expect(result.roi).toBe(0); // 500000 - 500000
      expect(result.roiPercentage).toBe(0);
      expect(result.paybackPeriod).toBeGreaterThan(0);
      expect(result.breakdown.revenue).toBe(800000);
      expect(result.breakdown.costs).toBe(300000);
      expect(result.breakdown.netProfit).toBe(500000);
    });

    it('should calculate positive ROI', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          totalInvestment: 300000,
          expectedRevenue: 800000,
          expectedCosts: 200000,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.calculateROI(mockUserId, 'sim-1');

      expect(result.expectedReturn).toBe(600000); // 800000 - 200000
      expect(result.roi).toBe(300000); // 600000 - 300000
      expect(result.roiPercentage).toBe(100); // (300000 / 300000) * 100
    });

    it('should handle zero investment edge case', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          totalInvestment: 0,
          expectedRevenue: 100000,
          expectedCosts: 50000,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.calculateROI(mockUserId, 'sim-1');

      expect(result.roi).toBe(0);
      expect(result.roiPercentage).toBe(0);
      expect(result.paybackPeriod).toBe(0);
    });
  });

  describe('optimizeHedge', () => {
    it('should calculate optimal hedge strategy', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          exposureAmount: 1000000,
          currentPrice: 150,
          targetPrice: 130,
          volatility: 0.2,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.optimizeHedge(mockUserId, 'sim-1');

      expect(result.simulationId).toBe('sim-1');
      expect(result.recommendedStrategy).toBe('Optimal');
      expect(result.hedgeRatio).toBeGreaterThan(0);
      expect(result.hedgeRatio).toBeLessThanOrEqual(1);
      expect(result.scenarios).toHaveLength(4);
      expect(result.scenarios[0].name).toBe('Conservative (100% hedge)');
      expect(result.riskMetrics.priceRisk).toBeCloseTo(0.133, 2);
      expect(result.riskMetrics.volatility).toBe(0.2);
    });

    it('should use default volatility if not provided', async () => {
      const simulation = {
        id: 'sim-1',
        userId: mockUserId,
        parameters: {
          exposureAmount: 500000,
          currentPrice: 100,
          targetPrice: 95,
        },
      };

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulation);

      const result = await service.optimizeHedge(mockUserId, 'sim-1');

      expect(result.riskMetrics.volatility).toBe(0.15); // Default
    });
  });

  describe('compareScenarios', () => {
    it('should compare multiple simulations', async () => {
      const simulations = [
        {
          id: 'sim-1',
          name: 'Conservative',
          type: SimulationType.HEDGE,
          status: SimulationStatus.COMPLETED,
          userId: mockUserId,
          parameters: { expectedRevenue: 500000 },
          results: {
            statistics: { avgProfit: 100000, avgROI: 20, stdDevProfit: 10000 },
          },
        },
        {
          id: 'sim-2',
          name: 'Aggressive',
          type: SimulationType.PRODUCTION,
          status: SimulationStatus.COMPLETED,
          userId: mockUserId,
          parameters: { expectedRevenue: 800000 },
          results: {
            statistics: { avgProfit: 200000, avgROI: 40, stdDevProfit: 50000 },
          },
        },
        {
          id: 'sim-3',
          name: 'Moderate',
          type: SimulationType.INSURANCE,
          status: SimulationStatus.COMPLETED,
          userId: mockUserId,
          parameters: { expectedRevenue: 650000 },
          results: {
            statistics: { avgProfit: 150000, avgROI: 30, stdDevProfit: 25000 },
          },
        },
      ];

      mockPrismaService.simulation.findFirst
        .mockResolvedValueOnce(simulations[0])
        .mockResolvedValueOnce(simulations[1])
        .mockResolvedValueOnce(simulations[2]);

      const result = await service.compareScenarios(mockUserId, [
        'sim-1',
        'sim-2',
        'sim-3',
      ]);

      expect(result.simulationIds).toEqual(['sim-1', 'sim-2', 'sim-3']);
      expect(result.scenarios).toHaveLength(3);
      expect(result.bestScenarioId).toBe('sim-2'); // Highest profit
      expect(result.comparison.byProfit[0].simulationId).toBe('sim-2');
      expect(result.comparison.byROI[0].simulationId).toBe('sim-2');
      expect(result.comparison.byRisk[0].simulationId).toBe('sim-1'); // Lowest risk
      expect(result.rankings['sim-2']).toBeDefined();
      expect(result.rankings['sim-2'].profitRank).toBe(1);
    });

    it('should handle simulations without results', async () => {
      const simulations = [
        {
          id: 'sim-1',
          name: 'Draft Sim',
          type: SimulationType.HEDGE,
          status: SimulationStatus.DRAFT,
          userId: mockUserId,
          parameters: { expectedRevenue: 500000, expectedCosts: 400000 },
          results: null,
        },
      ];

      mockPrismaService.simulation.findFirst.mockResolvedValue(simulations[0]);

      const result = await service.compareScenarios(mockUserId, ['sim-1']);

      expect(result.scenarios[0].expectedProfit).toBeGreaterThanOrEqual(0);
      expect(result.scenarios[0].roi).toBeDefined();
    });
  });
});
