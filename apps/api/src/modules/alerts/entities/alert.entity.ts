import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AlertType, AlertSeverity } from '../dto/create-alert.input';
import { AlertStatus } from '../dto/update-alert.input';

@ObjectType()
export class Alert {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => AlertType)
  type: AlertType;

  @Field(() => AlertSeverity)
  severity: AlertSeverity;

  @Field(() => AlertStatus)
  status: AlertStatus;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  metadata?: string;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
