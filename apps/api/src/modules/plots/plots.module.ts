import { Module } from '@nestjs/common';
import { PlotsService } from './plots.service';
import { PlotsResolver } from './plots.resolver';

@Module({
  providers: [PlotsService, PlotsResolver]
})
export class PlotsModule {}
