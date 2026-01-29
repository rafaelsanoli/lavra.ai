import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
}
