import { Test, TestingModule } from '@nestjs/testing';
import { PlantingsResolver } from './plantings.resolver';

describe('PlantingsResolver', () => {
  let resolver: PlantingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantingsResolver],
    }).compile();

    resolver = module.get<PlantingsResolver>(PlantingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
