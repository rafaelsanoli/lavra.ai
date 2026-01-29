import { InputType, Field, PartialType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { IsOptional, IsString, IsEnum, IsObject, IsArray } from 'class-validator';
import { SimulationType, SimulationStatus } from '../entities/simulation.entity';
import { CreateSimulationInput } from './create-simulation.input';

@InputType()
export class UpdateSimulationInput extends PartialType(CreateSimulationInput) {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  results?: Record<string, any>;

  @Field(() => SimulationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SimulationStatus)
  status?: SimulationStatus;
}
