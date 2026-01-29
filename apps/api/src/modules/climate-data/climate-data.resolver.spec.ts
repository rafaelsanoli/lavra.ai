import { Test, TestingModule } from '@nestjs/testing';
import { ClimateDataResolver } from './climate-data.resolver';

describe('ClimateDataResolver', () => {
  let resolver: ClimateDataResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClimateDataResolver],
    }).compile();

    resolver = module.get<ClimateDataResolver>(ClimateDataResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
