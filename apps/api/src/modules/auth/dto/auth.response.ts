import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserPayload)
  user: UserPayload;
}
