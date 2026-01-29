import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AlertsService } from './alerts.service';
import { Alert } from './entities/alert.entity';
import { CreateAlertInput, AlertType, AlertSeverity } from './dto/create-alert.input';
import { UpdateAlertInput, AlertStatus } from './dto/update-alert.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => Alert)
@UseGuards(GqlAuthGuard)
export class AlertsResolver {
  constructor(private readonly alertsService: AlertsService) {}

  @Mutation(() => Alert)
  createAlert(
    @CurrentUser('sub') userId: string,
    @Args('createAlertInput') createAlertInput: CreateAlertInput,
  ) {
    return this.alertsService.create(userId, createAlertInput);
  }

  @Query(() => [Alert], { name: 'alerts' })
  findAll(
    @CurrentUser('sub') userId: string,
    @Args('type', { type: () => AlertType, nullable: true }) type?: AlertType,
    @Args('status', { type: () => AlertStatus, nullable: true }) status?: AlertStatus,
    @Args('onlyActive', { nullable: true }) onlyActive?: boolean,
  ) {
    return this.alertsService.findAll(userId, type, status, onlyActive);
  }

  @Query(() => Alert, { name: 'alert' })
  findOne(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.alertsService.findOne(id, userId);
  }

  @Mutation(() => Alert)
  updateAlert(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
    @Args('updateAlertInput') updateAlertInput: UpdateAlertInput,
  ) {
    return this.alertsService.update(id, userId, updateAlertInput);
  }

  @Mutation(() => Alert)
  removeAlert(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.alertsService.remove(id, userId);
  }

  @Mutation(() => Alert)
  markAlertAsRead(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.alertsService.markAsRead(id, userId);
  }

  @Mutation(() => Alert)
  markAlertAsResolved(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.alertsService.markAsResolved(id, userId);
  }

  @Mutation(() => Alert)
  markAlertAsDismissed(
    @CurrentUser('sub') userId: string,
    @Args('id') id: string,
  ) {
    return this.alertsService.markAsDismissed(id, userId);
  }

  @Mutation(() => Int)
  markAllAlertsAsRead(@CurrentUser('sub') userId: string) {
    return this.alertsService.markAllAsRead(userId).then((result) => result.count);
  }

  @Query(() => Int, { name: 'unreadAlertsCount' })
  countUnread(@CurrentUser('sub') userId: string) {
    return this.alertsService.countUnread(userId);
  }

  @Mutation(() => Int)
  removeExpiredAlerts(@CurrentUser('sub') userId: string) {
    return this.alertsService.removeExpired(userId).then((result) => result.count);
  }
}

