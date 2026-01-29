import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { Farm } from './entities/farm.entity';
import { CreateFarmInput } from './dto/create-farm.input';
import { UpdateFarmInput } from './dto/update-farm.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => Farm)
@UseGuards(GqlAuthGuard)
export class FarmsResolver {
  constructor(private farmsService: FarmsService) {}

  @Mutation(() => Farm)
  async createFarm(
    @CurrentUser('userId') userId: string,
    @Args('createFarmInput') createFarmInput: CreateFarmInput,
  ) {
    return this.farmsService.create(userId, createFarmInput);
  }

  @Query(() => [Farm])
  async farms(@CurrentUser('userId') userId: string) {
    return this.farmsService.findAll(userId);
  }

  @Query(() => Farm)
  async farm(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.farmsService.findOne(id, userId);
  }

  @Mutation(() => Farm)
  async updateFarm(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
    @Args('updateFarmInput') updateFarmInput: UpdateFarmInput,
  ) {
    return this.farmsService.update(id, userId, updateFarmInput);
  }

  @Mutation(() => Boolean)
  async removeFarm(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.farmsService.remove(id, userId);
  }
}
