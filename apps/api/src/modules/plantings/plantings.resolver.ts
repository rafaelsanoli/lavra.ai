import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PlantingsService } from './plantings.service';
import { Planting } from './entities/planting.entity';
import { CreatePlantingInput } from './dto/create-planting.input';
import { UpdatePlantingInput, PlantingStatus } from './dto/update-planting.input';

@Resolver(() => Planting)
@UseGuards(GqlAuthGuard)
export class PlantingsResolver {
  constructor(private plantingsService: PlantingsService) {}

  @Mutation(() => Planting, {
    description: 'Cria um novo plantio no talhão. Valida ownership, datas e área disponível.'
  })
  async createPlanting(
    @CurrentUser() user: any,
    @Args('createPlantingInput') input: CreatePlantingInput
  ): Promise<Planting> {
    return this.plantingsService.create(user.sub, input);
  }

  @Query(() => [Planting], {
    description: 'Lista todos os plantios do usuário. Permite filtrar por talhão e status.'
  })
  async plantings(
    @CurrentUser() user: any,
    @Args('plotId', { nullable: true, description: 'Filtrar por talhão específico' })
    plotId?: string,
    @Args('status', { nullable: true, type: () => PlantingStatus, description: 'Filtrar por status' })
    status?: PlantingStatus
  ): Promise<Planting[]> {
    return this.plantingsService.findAll(user.sub, plotId, status);
  }

  @Query(() => Planting, {
    description: 'Busca um plantio específico por ID. Valida ownership.'
  })
  async planting(
    @CurrentUser() user: any,
    @Args('id', { description: 'ID do plantio' }) id: string
  ): Promise<Planting> {
    return this.plantingsService.findOne(user.sub, id);
  }

  @Mutation(() => Planting, {
    description: 'Atualiza um plantio existente. Valida transições de status e ownership.'
  })
  async updatePlanting(
    @CurrentUser() user: any,
    @Args('id', { description: 'ID do plantio' }) id: string,
    @Args('updatePlantingInput') input: UpdatePlantingInput
  ): Promise<Planting> {
    return this.plantingsService.update(user.sub, id, input);
  }

  @Mutation(() => Planting, {
    description: 'Remove um plantio. Não permite se houver colheitas registradas.'
  })
  async removePlanting(
    @CurrentUser() user: any,
    @Args('id', { description: 'ID do plantio' }) id: string
  ): Promise<Planting> {
    return this.plantingsService.remove(user.sub, id);
  }
}
