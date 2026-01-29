import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  MaxLength,
  IsArray,
} from 'class-validator';
import { SimulationType } from '../entities/simulation.entity';

@InputType()
export class CreateSimulationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @Field(() => SimulationType)
  @IsNotEmpty()
  @IsEnum(SimulationType)
  type: SimulationType;

  @Field(() => GraphQLJSON)
  @IsNotEmpty()
  @IsObject()
  parameters: Record<string, any>;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsArray()
  scenarios?: Array<Record<string, any>>;

  @Field()
  @IsNotEmpty()
  @IsString()
  farmId: string;
}
