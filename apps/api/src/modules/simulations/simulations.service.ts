import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSimulationInput } from './dto/create-simulation.input';
import { UpdateSimulationInput } from './dto/update-simulation.input';
import {
  Simulation,
  SimulationStatus,
  SimulationType,
  SimulationResult,
  BreakevenAnalysis,
  ROIAnalysis,
  HedgeOptimization,
  ScenarioComparison,
} from './entities/simulation.entity';

@Injectable()
export class SimulationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createSimulationInput: CreateSimulationInput,
  ): Promise<Simulation> {
    return this.prisma.simulation.create({
      data: {
        ...createSimulationInput,
        userId,
        status: SimulationStatus.DRAFT,
      },
    }) as any;
  }

  async findAll(
    userId: string,
    type?: SimulationType,
    status?: SimulationStatus,
    farmId?: string,
  ): Promise<Simulation[]> {
    const where: any = { userId };

    if (type) where.type = type;
    if (status) where.status = status;
    if (farmId) where.farmId = farmId;

    return this.prisma.simulation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }) as any;
  }

  async findOne(userId: string, id: string): Promise<Simulation> {
    const simulation = await this.prisma.simulation.findFirst({
      where: { id, userId },
    });

    if (!simulation) {
      throw new NotFoundException(`Simulation with ID ${id} not found`);
    }

    return simulation as any;
  }

  async update(
    userId: string,
    id: string,
    updateSimulationInput: UpdateSimulationInput,
  ): Promise<Simulation> {
    await this.findOne(userId, id);

    return this.prisma.simulation.update({
      where: { id },
      data: updateSimulationInput,
    }) as any;
  }

  async remove(userId: string, id: string): Promise<Simulation> {
    await this.findOne(userId, id);

    return this.prisma.simulation.delete({
      where: { id },
    }) as any;
  }

  async runSimulation(userId: string, id: string): Promise<SimulationResult> {
    const simulation = await this.findOne(userId, id);

    // Update status to RUNNING
    await this.prisma.simulation.update({
      where: { id },
      data: { status: SimulationStatus.RUNNING },
    });

    try {
      // Execute simulation based on type
      const scenarios = simulation.scenarios || [];
      const results = this.executeSimulationScenarios(simulation, scenarios);

      // Find best and worst scenarios
      const sortedScenarios = [...results].sort(
        (a, b) => b.expectedProfit - a.expectedProfit,
      );
      const bestScenario = sortedScenarios[0];
      const worstScenario = sortedScenarios[sortedScenarios.length - 1];

      // Calculate statistics
      const statistics = this.calculateScenarioStatistics(results);

      // Update simulation with results
      const resultData = {
        scenarios: results,
        bestScenario,
        worstScenario,
        statistics,
      };

      await this.prisma.simulation.update({
        where: { id },
        data: {
          status: SimulationStatus.COMPLETED,
          results: resultData as any,
        },
      });

      return {
        simulationId: id,
        scenarios: results,
        bestScenario,
        worstScenario,
        statistics,
        executedAt: new Date(),
      };
    } catch (error) {
      // Mark as failed
      await this.prisma.simulation.update({
        where: { id },
        data: { status: SimulationStatus.FAILED },
      });
      throw error;
    }
  }

  async calculateBreakeven(
    userId: string,
    id: string,
  ): Promise<BreakevenAnalysis> {
    const simulation = await this.findOne(userId, id);
    const params = simulation.parameters;

    const fixedCosts = params.fixedCosts || 0;
    const variableCostPerUnit = params.variableCostPerUnit || 0;
    const pricePerUnit = params.pricePerUnit || 1;

    // Breakeven Quantity = Fixed Costs / (Price - Variable Cost per Unit)
    const breakevenQuantity =
      pricePerUnit > variableCostPerUnit
        ? fixedCosts / (pricePerUnit - variableCostPerUnit)
        : 0;

    // Breakeven Price = (Fixed Costs / Quantity) + Variable Cost per Unit
    const expectedQuantity = params.expectedQuantity || 1;
    const breakevenPrice =
      fixedCosts / expectedQuantity + variableCostPerUnit;

    const analysis = {
      contributionMargin: pricePerUnit - variableCostPerUnit,
      contributionMarginRatio:
        pricePerUnit > 0
          ? ((pricePerUnit - variableCostPerUnit) / pricePerUnit) * 100
          : 0,
      safetyMargin:
        expectedQuantity > breakevenQuantity
          ? ((expectedQuantity - breakevenQuantity) / expectedQuantity) * 100
          : 0,
    };

    return {
      simulationId: id,
      breakevenPrice: Math.round(breakevenPrice * 100) / 100,
      breakevenQuantity: Math.round(breakevenQuantity),
      totalFixedCosts: fixedCosts,
      totalVariableCosts: variableCostPerUnit * expectedQuantity,
      analysis,
    };
  }

  async calculateROI(userId: string, id: string): Promise<ROIAnalysis> {
    const simulation = await this.findOne(userId, id);
    const params = simulation.parameters;

    const totalInvestment = params.totalInvestment || 0;
    const expectedRevenue = params.expectedRevenue || 0;
    const expectedCosts = params.expectedCosts || 0;

    const expectedReturn = expectedRevenue - expectedCosts;
    const roi = totalInvestment > 0 ? expectedReturn - totalInvestment : 0;
    const roiPercentage =
      totalInvestment > 0 ? (roi / totalInvestment) * 100 : 0;

    // Payback period in months
    const monthlyReturn = expectedReturn / 12;
    const paybackPeriod =
      monthlyReturn > 0 ? totalInvestment / monthlyReturn : 0;

    const breakdown = {
      revenue: expectedRevenue,
      costs: expectedCosts,
      netProfit: expectedReturn,
      investmentEfficiency: totalInvestment > 0 ? expectedReturn / totalInvestment : 0,
    };

    return {
      simulationId: id,
      totalInvestment,
      expectedReturn,
      roi,
      roiPercentage: Math.round(roiPercentage * 100) / 100,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      breakdown,
    };
  }

  async optimizeHedge(
    userId: string,
    id: string,
  ): Promise<HedgeOptimization> {
    const simulation = await this.findOne(userId, id);
    const params = simulation.parameters;

    const exposureAmount = params.exposureAmount || 0;
    const currentPrice = params.currentPrice || 0;
    const targetPrice = params.targetPrice || 0;
    const volatility = params.volatility || 0.15; // 15% default

    // Calculate optimal hedge ratio (simplified)
    const priceRisk = Math.abs(currentPrice - targetPrice) / currentPrice;
    const hedgeRatio = Math.min(priceRisk + volatility, 1.0);

    const hedgeAmount = exposureAmount * hedgeRatio;
    const estimatedCost = hedgeAmount * 0.02; // 2% hedge cost
    const expectedProtection = hedgeAmount * priceRisk;

    // Generate scenarios
    const scenarios = [
      {
        name: 'Conservative (100% hedge)',
        hedgeRatio: 1.0,
        cost: exposureAmount * 0.02,
        protection: exposureAmount * priceRisk,
        netExposure: 0,
      },
      {
        name: 'Optimal',
        hedgeRatio,
        cost: estimatedCost,
        protection: expectedProtection,
        netExposure: exposureAmount * (1 - hedgeRatio),
      },
      {
        name: 'Aggressive (50% hedge)',
        hedgeRatio: 0.5,
        cost: exposureAmount * 0.5 * 0.02,
        protection: exposureAmount * 0.5 * priceRisk,
        netExposure: exposureAmount * 0.5,
      },
      {
        name: 'No hedge',
        hedgeRatio: 0,
        cost: 0,
        protection: 0,
        netExposure: exposureAmount,
      },
    ];

    const riskMetrics = {
      priceRisk,
      volatility,
      valueAtRisk: exposureAmount * priceRisk * volatility,
      maxDrawdown: exposureAmount * priceRisk * (1 - hedgeRatio),
    };

    return {
      simulationId: id,
      recommendedStrategy: 'Optimal',
      hedgeRatio: Math.round(hedgeRatio * 100) / 100,
      expectedProtection: Math.round(expectedProtection),
      estimatedCost: Math.round(estimatedCost),
      scenarios,
      riskMetrics,
    };
  }

  async compareScenarios(
    userId: string,
    simulationIds: string[],
  ): Promise<ScenarioComparison> {
    const simulations = await Promise.all(
      simulationIds.map((id) => this.findOne(userId, id)),
    );

    const scenarios = simulations.map((sim) => ({
      simulationId: sim.id,
      name: sim.name,
      type: sim.type,
      status: sim.status,
      results: sim.results,
      expectedProfit:
        (sim.results as any)?.statistics?.avgProfit ||
        (sim.parameters as any)?.expectedRevenue ||
        0,
      roi:
        (sim.results as any)?.statistics?.avgROI ||
        this.calculateSimpleROI(sim.parameters as any),
      risk:
        (sim.results as any)?.statistics?.stdDevProfit ||
        (sim.parameters as any)?.volatility ||
        0,
    }));

    // Rank by expected profit
    const rankedByProfit = [...scenarios].sort(
      (a, b) => b.expectedProfit - a.expectedProfit,
    );
    const bestScenarioId = rankedByProfit[0]?.simulationId || '';

    // Create comparison matrix
    const comparison = {
      byProfit: rankedByProfit.map((s, i) => ({
        rank: i + 1,
        simulationId: s.simulationId,
        name: s.name,
        expectedProfit: s.expectedProfit,
      })),
      byROI: [...scenarios]
        .sort((a, b) => b.roi - a.roi)
        .map((s, i) => ({
          rank: i + 1,
          simulationId: s.simulationId,
          name: s.name,
          roi: s.roi,
        })),
      byRisk: [...scenarios]
        .sort((a, b) => a.risk - b.risk)
        .map((s, i) => ({
          rank: i + 1,
          simulationId: s.simulationId,
          name: s.name,
          risk: s.risk,
        })),
    };

    const rankings = scenarios.reduce((acc, s) => {
      const profitRank =
        rankedByProfit.findIndex((r) => r.simulationId === s.simulationId) + 1;
      const roiRank =
        comparison.byROI.findIndex((r) => r.simulationId === s.simulationId) +
        1;
      const riskRank =
        comparison.byRisk.findIndex((r) => r.simulationId === s.simulationId) +
        1;

      acc[s.simulationId] = {
        profitRank,
        roiRank,
        riskRank,
        overallScore: (profitRank + roiRank + riskRank) / 3,
      };
      return acc;
    }, {} as any);

    return {
      simulationIds,
      scenarios,
      comparison,
      bestScenarioId,
      rankings,
    };
  }

  // Helper methods
  private executeSimulationScenarios(
    simulation: Simulation,
    scenarios: any[],
  ): any[] {
    const baseParams = simulation.parameters;

    // If no scenarios provided, generate default ones
    if (scenarios.length === 0) {
      scenarios = this.generateDefaultScenarios(simulation.type, baseParams);
    }

    return scenarios.map((scenario, index) => {
      const scenarioParams = { ...baseParams, ...scenario };
      const result = this.calculateScenarioOutcome(
        simulation.type,
        scenarioParams,
      );

      return {
        scenarioId: `scenario-${index + 1}`,
        name: scenario.name || `Scenario ${index + 1}`,
        parameters: scenarioParams,
        ...result,
      };
    });
  }

  private generateDefaultScenarios(
    type: SimulationType,
    baseParams: any,
  ): any[] {
    switch (type) {
      case SimulationType.HEDGE:
        return [
          { name: 'Pessimistic', priceChange: -0.15 },
          { name: 'Expected', priceChange: 0 },
          { name: 'Optimistic', priceChange: 0.15 },
        ];
      case SimulationType.PRODUCTION:
        return [
          { name: 'Low Yield', yieldMultiplier: 0.8 },
          { name: 'Expected Yield', yieldMultiplier: 1.0 },
          { name: 'High Yield', yieldMultiplier: 1.2 },
        ];
      case SimulationType.INSURANCE:
        return [
          { name: 'No Loss', lossPercentage: 0 },
          { name: 'Moderate Loss', lossPercentage: 0.3 },
          { name: 'Severe Loss', lossPercentage: 0.7 },
        ];
      default:
        return [
          { name: 'Pessimistic' },
          { name: 'Expected' },
          { name: 'Optimistic' },
        ];
    }
  }

  private calculateScenarioOutcome(
    type: SimulationType,
    params: any,
  ): Record<string, any> {
    const revenue = params.expectedRevenue || 0;
    const costs = params.expectedCosts || 0;
    const quantity = params.expectedQuantity || 0;
    const price = params.pricePerUnit || 0;

    let adjustedRevenue = revenue;
    let adjustedCosts = costs;

    // Apply scenario-specific adjustments
    if (params.priceChange) {
      adjustedRevenue = revenue * (1 + params.priceChange);
    }
    if (params.yieldMultiplier) {
      adjustedRevenue = revenue * params.yieldMultiplier;
    }
    if (params.lossPercentage) {
      adjustedRevenue = revenue * (1 - params.lossPercentage);
    }

    const profit = adjustedRevenue - adjustedCosts;
    const profitMargin = adjustedRevenue > 0 ? (profit / adjustedRevenue) * 100 : 0;
    const roi = costs > 0 ? (profit / costs) * 100 : 0;

    return {
      expectedRevenue: Math.round(adjustedRevenue),
      expectedCosts: Math.round(adjustedCosts),
      expectedProfit: Math.round(profit),
      profitMargin: Math.round(profitMargin * 100) / 100,
      roi: Math.round(roi * 100) / 100,
    };
  }

  private calculateScenarioStatistics(scenarios: any[]): Record<string, any> {
    const profits = scenarios.map((s) => s.expectedProfit);
    const rois = scenarios.map((s) => s.roi);

    const avgProfit = profits.reduce((a, b) => a + b, 0) / profits.length;
    const avgROI = rois.reduce((a, b) => a + b, 0) / rois.length;

    const stdDevProfit = Math.sqrt(
      profits.reduce((sum, p) => sum + Math.pow(p - avgProfit, 2), 0) /
        profits.length,
    );

    return {
      avgProfit: Math.round(avgProfit),
      avgROI: Math.round(avgROI * 100) / 100,
      stdDevProfit: Math.round(stdDevProfit),
      minProfit: Math.min(...profits),
      maxProfit: Math.max(...profits),
      scenarioCount: scenarios.length,
    };
  }

  private calculateSimpleROI(params: any): number {
    const revenue = params.expectedRevenue || 0;
    const costs = params.expectedCosts || params.totalInvestment || 0;
    return costs > 0 ? ((revenue - costs) / costs) * 100 : 0;
  }
}
