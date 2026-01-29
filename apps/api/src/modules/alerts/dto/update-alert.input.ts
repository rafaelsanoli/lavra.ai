import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

export enum AlertStatus {
  PENDING = 'PENDING',
  READ = 'READ',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

registerEnumType(AlertStatus, { name: 'AlertStatus' });

@InputType()
export class UpdateAlertInput {
  @Field(() => AlertStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;
}
