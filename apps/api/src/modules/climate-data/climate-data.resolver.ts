import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClimateDataService } from './climate-data.service';
import { ClimateData } from './entities/climate-data.entity';
import { CreateClimateDataInput } from './dto/create-climate-data.input';
import { UpdateClimateDataInput } from './dto/update-climate-data.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => ClimateData)
@UseGuards(GqlAuthGuard)
export class ClimateDataResolver {
  constructor(private readonly climateDataService: ClimateDataService) {}

  @Mutation(() => ClimateData)
  createClimateData(
    @CurrentUser('sub') userId: string,
    @Args('createClimateDataInput') createClimateDataInput: CreateClimateDataInput,
  ) {
    return this.climateDataService.create(userId, createClimateDataInput);
  }

  @Query(() => [ClimateData], { name: 'climateData' })
  findAll(
    @CurrentUser('sub') userId: string,
    @Args('farmId', { nullable: true }) farmId?: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ) {
    return this.climateDataService.findAll(userId, farmId, startDate, endDate);
  }

  @Query(() => ClimateData, { name: 'climateDataItem' })
  findOne(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.climateDataService.findOne(id, userId);
  }

  @Mutation(() => ClimateData)
  updateClimateData(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
    @Args('updateClimateDataInput') updateClimateDataInput: UpdateClimateDataInput,
  ) {
    return this.climateDataService.update(id, userId, updateClimateDataInput);
  }

  @Mutation(() => ClimateData)
  removeClimateData(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.climateDataService.remove(id, userId);
  }

  @Mutation(() => ClimateData)
  fetchWeatherData(
    @CurrentUser('sub') userId: string,
    @Args('farmId') farmId: string,
  ) {
    return this.climateDataService.fetchFromOpenWeather(farmId, userId);
  }
}
