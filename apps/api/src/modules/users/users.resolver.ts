import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    return this.usersService.updateProfile(userId, updateProfileInput);
  }
}
