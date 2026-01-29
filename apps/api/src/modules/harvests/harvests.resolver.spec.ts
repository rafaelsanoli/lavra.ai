import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsResolver } from './harvests.resolver';

describe('HarvestsResolver', () => {
  let resolver: HarvestsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HarvestsResolver],
    }).compile();

    resolver = module.get<HarvestsResolver>(HarvestsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
