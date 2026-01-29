import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

export enum SimulationType {
  HEDGE = 'HEDGE',
  INSURANCE = 'INSURANCE',
  PRODUCTION = 'PRODUCTION',
  MARKET = 'MARKET',
}

export enum SimulationStatus {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

registerEnumType(SimulationType, {
  name: 'SimulationType',
  description: 'Tipo de simulação',
});

registerEnumType(SimulationStatus, {
  name: 'SimulationStatus',
  description: 'Status da simulação',
});

@ObjectType()
export class Simulation {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SimulationType)
  type: SimulationType;

  @Field(() => GraphQLJSON)
  parameters: Record<string, any>;

  @Field(() => [GraphQLJSON], { nullable: true })
  scenarios?: Array<Record<string, any>>;

  @Field(() => GraphQLJSON, { nullable: true })
  results?: Record<string, any>;

  @Field(() => SimulationStatus)
  status: SimulationStatus;

  @Field()
  userId: string;

  @Field()
  farmId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SimulationResult {
  @Field()
  simulationId: string;

  @Field(() => GraphQLJSON)
  scenarios: Array<Record<string, any>>;

  @Field(() => GraphQLJSON)
  bestScenario: Record<string, any>;

  @Field(() => GraphQLJSON)
  worstScenario: Record<string, any>;

  @Field(() => GraphQLJSON)
  statistics: Record<string, any>;

  @Field()
  executedAt: Date;
}

@ObjectType()
export class BreakevenAnalysis {
  @Field()
  simulationId: string;

  @Field()
  breakevenPrice: number;

  @Field()
  breakevenQuantity: number;

  @Field()
  totalFixedCosts: number;

  @Field()
  totalVariableCosts: number;

  @Field(() => GraphQLJSON)
  analysis: Record<string, any>;
}

@ObjectType()
export class ROIAnalysis {
  @Field()
  simulationId: string;

  @Field()
  totalInvestment: number;

  @Field()
  expectedReturn: number;

  @Field()
  roi: number;

  @Field()
  roiPercentage: number;

  @Field()
  paybackPeriod: number;

  @Field(() => GraphQLJSON)
  breakdown: Record<string, any>;
}

@ObjectType()
export class HedgeOptimization {
  @Field()
  simulationId: string;

  @Field()
  recommendedStrategy: string;

  @Field()
  hedgeRatio: number;

  @Field()
  expectedProtection: number;

  @Field()
  estimatedCost: number;

  @Field(() => [GraphQLJSON])
  scenarios: Array<Record<string, any>>;

  @Field(() => GraphQLJSON)
  riskMetrics: Record<string, any>;
}

@ObjectType()
export class ScenarioComparison {
  @Field(() => [String])
  simulationIds: string[];

  @Field(() => [GraphQLJSON])
  scenarios: Array<Record<string, any>>;

  @Field(() => GraphQLJSON)
  comparison: Record<string, any>;

  @Field()
  bestScenarioId: string;

  @Field(() => GraphQLJSON)
  rankings: Record<string, any>;
}
