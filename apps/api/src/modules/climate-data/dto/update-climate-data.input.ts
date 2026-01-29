import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateClimateDataInput {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(-50)
  @Max(60)
  temperature?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rainfall?: number;

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
