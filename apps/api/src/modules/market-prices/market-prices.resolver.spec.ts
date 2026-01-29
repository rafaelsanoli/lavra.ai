import { Test, TestingModule } from '@nestjs/testing';
import { MarketPricesResolver } from './market-prices.resolver';

describe('MarketPricesResolver', () => {
  let resolver: MarketPricesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketPricesResolver],
    }).compile();

    resolver = module.get<MarketPricesResolver>(MarketPricesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
