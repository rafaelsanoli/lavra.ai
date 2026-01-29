import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HarvestsService } from './harvests.service';
import { Harvest } from './entities/harvest.entity';
import { CreateHarvestInput } from './dto/create-harvest.input';
import { UpdateHarvestInput } from './dto/update-harvest.input';

@Resolver(() => Harvest)
@UseGuards(GqlAuthGuard)
export class HarvestsResolver {
  constructor(private harvestsService: HarvestsService) {}

  @Mutation(() => Harvest, {
    description: 'Registra uma nova colheita. Calcula automaticamente produtividade e valor total.'
  })
  async createHarvest(
    @CurrentUser() user: any,
    @Args('createHarvestInput') input: CreateHarvestInput
  ): Promise<Harvest> {
    return this.harvestsService.create(user.sub, input);
  }

  @Query(() => [Harvest], {
    description: 'Lista todas as colheitas do usuário. Permite filtrar por plantio.'
  })
  async harvests(
    @CurrentUser() user: any,
    @Args('plantingId', { nullable: true, description: 'Filtrar por plantio específico' })
    plantingId?: string
  ): Promise<Harvest[]> {
    return this.harvestsService.findAll(user.sub, plantingId);
  }

  @Query(() => Harvest, {
    description: 'Busca uma colheita específica por ID. Valida ownership.'
  })
  async harvest(
    @CurrentUser() user: any,
    @Args('id', { description: 'ID da colheita' }) id: string
  ): Promise<Harvest> {
    return this.harvestsService.findOne(user.sub, id);
  }

  @Mutation(() => Harvest, {
    description: 'Atualiza uma colheita existente. Recalcula valor total se preço for alterado.'
  })
  async updateHarvest(
    @CurrentUser() user: any,
    @Args('id', { description: 'ID da colheita' }) id: string,
    @Args('updateHarvestInput') input: UpdateHarvestInput
  ): Promise<Harvest> {
    return this.harvestsService.update(user.sub, id, input);
  }

  @Mutation(() => Harvest, {
    description: 'Remove uma colheita.'
  })
  async removeHarvest(
    @CurrentUser() user: any,
    @Args('id', { description: 'ID da colheita' }) id: string
  ): Promise<Harvest> {
    return this.harvestsService.remove(user.sub, id);
  }
}
