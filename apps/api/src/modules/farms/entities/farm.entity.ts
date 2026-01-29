import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Plot } from '../../plots/entities/plot.entity';

@ObjectType()
export class Farm {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  totalArea: number;

  @Field()
  userId: string;

  @Field(() => [Plot], { nullable: true })
  plots?: Plot[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
