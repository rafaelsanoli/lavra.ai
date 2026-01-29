import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ClimateData {
  @Field(() => ID)
  id: string;

  @Field()
  farmId: string;

  @Field()
  date: Date;

  @Field(() => Float)
  temperature: number;

  @Field(() => Float)
  humidity: number;

  @Field(() => Float)
  rainfall: number;

  @Field(() => Float, { nullable: true })
  windSpeed?: number;

  @Field(() => Float, { nullable: true })
  solarRadiation?: number;

  @Field({ nullable: true })
  source?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
