import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import {
  Simulation,
  SimulationType,
  SimulationStatus,
  SimulationResult,
  BreakevenAnalysis,
  ROIAnalysis,
  HedgeOptimization,
  ScenarioComparison,
} from './entities/simulation.entity';
import { CreateSimulationInput } from './dto/create-simulation.input';
import { UpdateSimulationInput } from './dto/update-simulation.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Simulation)
@UseGuards(JwtAuthGuard)
export class SimulationsResolver {
  constructor(private readonly simulationsService: SimulationsService) {}

  @Mutation(() => Simulation)
  createSimulation(
    @CurrentUser() user: any,
    @Args('createSimulationInput') createSimulationInput: CreateSimulationInput,
  ) {
    return this.simulationsService.create(user.userId, createSimulationInput);
  }

  @Query(() => [Simulation], { name: 'simulations' })
  findAll(
    @CurrentUser() user: any,
    @Args('type', { type: () => SimulationType, nullable: true })
    type?: SimulationType,
    @Args('status', { type: () => SimulationStatus, nullable: true })
    status?: SimulationStatus,
    @Args('farmId', { nullable: true }) farmId?: string,
  ) {
    return this.simulationsService.findAll(user.userId, type, status, farmId);
  }

  @Query(() => Simulation, { name: 'simulation' })
  findOne(@CurrentUser() user: any, @Args('id') id: string) {
    return this.simulationsService.findOne(user.userId, id);
  }

  @Mutation(() => Simulation)
  updateSimulation(
    @CurrentUser() user: any,
    @Args('id') id: string,
    @Args('updateSimulationInput') updateSimulationInput: UpdateSimulationInput,
  ) {
    return this.simulationsService.update(user.userId, id, updateSimulationInput);
  }

  @Mutation(() => Simulation)
  removeSimulation(@CurrentUser() user: any, @Args('id') id: string) {
    return this.simulationsService.remove(user.userId, id);
  }

  @Mutation(() => SimulationResult)
  runSimulation(@CurrentUser() user: any, @Args('id') id: string) {
    return this.simulationsService.runSimulation(user.userId, id);
  }

  @Query(() => BreakevenAnalysis)
  calculateBreakeven(@CurrentUser() user: any, @Args('id') id: string) {
    return this.simulationsService.calculateBreakeven(user.userId, id);
  }

  @Query(() => ROIAnalysis)
  calculateROI(@CurrentUser() user: any, @Args('id') id: string) {
    return this.simulationsService.calculateROI(user.userId, id);
  }

  @Query(() => HedgeOptimization)
  optimizeHedge(@CurrentUser() user: any, @Args('id') id: string) {
    return this.simulationsService.optimizeHedge(user.userId, id);
  }

  @Query(() => ScenarioComparison)
  compareScenarios(
    @CurrentUser() user: any,
    @Args('simulationIds', { type: () => [String] }) simulationIds: string[],
  ) {
    return this.simulationsService.compareScenarios(user.userId, simulationIds);
  }
}
