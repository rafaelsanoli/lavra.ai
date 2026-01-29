import { Module } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { FarmsResolver } from './farms.resolver';

@Module({
  providers: [FarmsService, FarmsResolver],
  exports: [FarmsService],
})
export class FarmsModule {}
