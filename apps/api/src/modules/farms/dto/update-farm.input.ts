import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateFarmInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  location?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalArea?: number;
}
