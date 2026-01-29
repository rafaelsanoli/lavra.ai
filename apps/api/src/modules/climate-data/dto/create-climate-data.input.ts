import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsDateString, IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateClimateDataInput {
  @Field()
  @IsUUID()
  farmId: string;

  @Field()
  @IsDateString()
  date: string;

  @Field(() => Float)
  @IsNumber()
  @Min(-50)
  @Max(60)
  temperature: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  rainfall: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  windSpeed?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  solarRadiation?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  source?: string;
}
