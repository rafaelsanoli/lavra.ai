import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, Min, MinLength } from 'class-validator';

@InputType()
export class CreateFarmInput {
  @Field()
  @IsString()
  @MinLength(3)
  name: string;

  @Field()
  @IsString()
  @MinLength(3)
  location: string;

  @Field(() => Float)
  @IsNumber()
  latitude: number;

  @Field(() => Float)
  @IsNumber()
  longitude: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  totalArea: number;
}
