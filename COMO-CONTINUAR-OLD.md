# 🛠️ Como Continuar o Desenvolvimento

Este guia mostra exatamente como você deve continuar desenvolvendo a Lavra.ia sozinho.

## 📋 Seu Ambiente Atual

✅ **Backend funcionando** em http://localhost:4000/graphql  
✅ **PostgreSQL** rodando na porta 5433  
✅ **Redis** rodando na porta 6379  
✅ **Prisma** configurado com 12 models  
✅ **3 módulos** implementados: Auth, Users, Farms  

## 🎯 Próximo Passo: Implementar Módulos Plots e Plantings

### 1️⃣ Criar módulo Plots

```bash
cd apps/api
npx nest g module modules/plots
npx nest g service modules/plots
npx nest g resolver modules/plots
```

### 2️⃣ Criar as entities e DTOs

**📁 src/modules/plots/entities/plot.entity.ts** (já existe ✅)

**📁 src/modules/plots/dto/create-plot.input.ts**
```typescript
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CreatePlotInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  farmId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  area: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  soilType?: string;
}
```

**📁 src/modules/plots/dto/update-plot.input.ts**
```typescript
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class UpdatePlotInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  soilType?: string;
}
```

### 3️⃣ Implementar o Service

**📁 src/modules/plots/plots.service.ts**
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlotInput } from './dto/create-plot.input';
import { UpdatePlotInput } from './dto/update-plot.input';

@Injectable()
export class PlotsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPlotInput: CreatePlotInput) {
    // Verificar se a fazenda pertence ao usuário
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: createPlotInput.farmId,
        userId,
      },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    return this.prisma.plot.create({
      data: createPlotInput,
      include: {
        farm: true,
        plantings: true,
      },
    });
  }

  async findAll(userId: string, farmId?: string) {
    const where: any = {
      farm: { userId },
    };

    if (farmId) {
      where.farmId = farmId;
    }

    return this.prisma.plot.findMany({
      where,
      include: {
        farm: true,
        plantings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const plot = await this.prisma.plot.findFirst({
      where: {
        id,
        farm: { userId },
      },
      include: {
        farm: true,
        plantings: {
          include: {
            harvests: true,
          },
        },
      },
    });

    if (!plot) {
      throw new NotFoundException('Talhão não encontrado');
    }

    return plot;
  }

  async update(id: string, userId: string, updatePlotInput: UpdatePlotInput) {
    const plot = await this.findOne(id, userId);

    return this.prisma.plot.update({
      where: { id: plot.id },
      data: updatePlotInput,
      include: {
        farm: true,
        plantings: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const plot = await this.findOne(id, userId);

    await this.prisma.plot.delete({
      where: { id: plot.id },
    });

    return true;
  }
}
```

### 4️⃣ Implementar o Resolver

**📁 src/modules/plots/plots.resolver.ts**
```typescript
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PlotsService } from './plots.service';
import { Plot } from './entities/plot.entity';
import { CreatePlotInput } from './dto/create-plot.input';
import { UpdatePlotInput } from './dto/update-plot.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => Plot)
@UseGuards(GqlAuthGuard)
export class PlotsResolver {
  constructor(private plotsService: PlotsService) {}

  @Mutation(() => Plot)
  async createPlot(
    @CurrentUser('userId') userId: string,
    @Args('createPlotInput') createPlotInput: CreatePlotInput,
  ) {
    return this.plotsService.create(userId, createPlotInput);
  }

  @Query(() => [Plot])
  async plots(
    @CurrentUser('userId') userId: string,
    @Args('farmId', { nullable: true }) farmId?: string,
  ) {
    return this.plotsService.findAll(userId, farmId);
  }

  @Query(() => Plot)
  async plot(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.plotsService.findOne(id, userId);
  }

  @Mutation(() => Plot)
  async updatePlot(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
    @Args('updatePlotInput') updatePlotInput: UpdatePlotInput,
  ) {
    return this.plotsService.update(id, userId, updatePlotInput);
  }

  @Mutation(() => Boolean)
  async removePlot(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.plotsService.remove(id, userId);
  }
}
```

### 5️⃣ Atualizar entidade Plot para incluir relações

**📁 src/modules/plots/entities/plot.entity.ts** (substituir)
```typescript
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Farm } from '../../farms/entities/farm.entity';

@ObjectType()
export class Planting {
  @Field(() => ID)
  id: string;

  @Field()
  cropType: string;

  @Field({ nullable: true })
  variety?: string;

  @Field()
  plantingDate: Date;

  @Field()
  expectedHarvest: Date;

  @Field({ nullable: true })
  actualHarvest?: Date;

  @Field()
  status: string;
}

@ObjectType()
export class Plot {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  farmId: string;

  @Field(() => Float)
  area: number;

  @Field({ nullable: true })
  soilType?: string;

  @Field(() => Farm, { nullable: true })
  farm?: Farm;

  @Field(() => [Planting], { nullable: true })
  plantings?: Planting[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
```

### 6️⃣ Registrar módulo no AppModule

**📁 src/app.module.ts** (adicionar PlotsModule)
```typescript
import { PlotsModule } from './modules/plots/plots.module';

@Module({
  imports: [
    // ... outros imports
    PlotsModule, // ← Adicionar aqui
  ],
})
export class AppModule {}
```

### 7️⃣ Testar o novo módulo

**GraphQL Playground:**

```graphql
# Criar talhão
mutation {
  createPlot(createPlotInput: {
    name: "Talhão Norte"
    farmId: "ID_DA_SUA_FAZENDA"
    area: 50.5
    soilType: "Argiloso"
  }) {
    id
    name
    area
    soilType
    farm {
      name
    }
  }
}

# Listar talhões
query {
  plots {
    id
    name
    area
    soilType
    farm {
      name
    }
  }
}
```

## 🔄 Padrão para Implementar Novos Módulos

Para criar qualquer novo módulo (Plantings, Harvests, Alerts, etc.), siga este padrão:

### **1. Gerar estrutura**
```bash
npx nest g module modules/nome-modulo
npx nest g service modules/nome-modulo
npx nest g resolver modules/nome-modulo
```

### **2. Criar arquivos**
```
modules/nome-modulo/
├── entities/
│   └── nome.entity.ts       # GraphQL ObjectType
├── dto/
│   ├── create-nome.input.ts # InputType para criar
│   └── update-nome.input.ts # InputType para atualizar
├── nome.module.ts           # Gerado automaticamente
├── nome.service.ts          # Lógica de negócio
└── nome.resolver.ts         # Mutations e Queries
```

### **3. Implementar Service**
```typescript
@Injectable()
export class NomeService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateNomeInput) {
    // Validações
    // Criar no banco
    return this.prisma.nome.create({ data });
  }

  async findAll(userId: string) {
    return this.prisma.nome.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    // Buscar e validar ownership
    return this.prisma.nome.findFirst({ where: { id, userId } });
  }

  async update(id: string, userId: string, data: UpdateNomeInput) {
    // Validar ownership
    return this.prisma.nome.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    // Validar ownership
    await this.prisma.nome.delete({ where: { id } });
    return true;
  }
}
```

### **4. Implementar Resolver**
```typescript
@Resolver(() => Nome)
@UseGuards(GqlAuthGuard)
export class NomeResolver {
  constructor(private nomeService: NomeService) {}

  @Mutation(() => Nome)
  async createNome(
    @CurrentUser('userId') userId: string,
    @Args('createNomeInput') createNomeInput: CreateNomeInput,
  ) {
    return this.nomeService.create(userId, createNomeInput);
  }

  @Query(() => [Nome])
  async nomes(@CurrentUser('userId') userId: string) {
    return this.nomeService.findAll(userId);
  }

  @Query(() => Nome)
  async nome(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.nomeService.findOne(id, userId);
  }

  @Mutation(() => Nome)
  async updateNome(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
    @Args('updateNomeInput') updateNomeInput: UpdateNomeInput,
  ) {
    return this.nomeService.update(id, userId, updateNomeInput);
  }

  @Mutation(() => Boolean)
  async removeNome(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.nomeService.remove(id, userId);
  }
}
```

## 🧪 Criar Testes

### **Unit Test (nome.service.spec.ts)**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { NomeService } from './nome.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('NomeService', () => {
  let service: NomeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NomeService,
        {
          provide: PrismaService,
          useValue: {
            nome: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NomeService>(NomeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const userId = 'user-123';
      const createDto = { name: 'Test' };
      const expected = { id: '1', ...createDto, userId };

      jest.spyOn(prisma.nome, 'create').mockResolvedValue(expected as any);

      const result = await service.create(userId, createDto);

      expect(result).toEqual(expected);
      expect(prisma.nome.create).toHaveBeenCalledWith({
        data: { ...createDto, userId },
      });
    });
  });
});
```

### **Rodar testes**
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## 📦 Integrar com Frontend

### **1. Instalar Apollo Client no Next.js**
```bash
cd apps/web
npm install @apollo/client graphql
```

### **2. Criar cliente Apollo**
**📁 apps/web/src/lib/apollo-client.ts**
```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### **3. Usar no componente**
```typescript
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_FARMS = gql`
  query GetFarms {
    farms {
      id
      name
      location
      totalArea
    }
  }
`;

const CREATE_FARM = gql`
  mutation CreateFarm($input: CreateFarmInput!) {
    createFarm(createFarmInput: $input) {
      id
      name
    }
  }
`;

export default function FarmsPage() {
  const { data, loading } = useQuery(GET_FARMS);
  const [createFarm] = useMutation(CREATE_FARM);

  // Usar data.farms...
}
```

## 🔥 Fluxo de Trabalho Diário

### **Manhã**
1. Pull últimas mudanças: `git pull`
2. Subir serviços: `docker compose up -d postgres redis`
3. Iniciar API: `cd apps/api && npm run start:dev`
4. Verificar: http://localhost:4000/graphql

### **Durante o dia**
1. Implementar 1 feature por vez
2. Testar no GraphQL Playground
3. Escrever testes unitários
4. Commit: `git add . && git commit -m "feat: descrição"`

### **Antes de parar**
1. Rodar testes: `npm run test`
2. Push: `git push`
3. Atualizar STATUS-ATUAL.md
4. Parar containers se necessário: `docker compose down`

## 📚 Documentação Técnica

### **Para consultar durante desenvolvimento:**
- `PLANO-BACKEND.md` - Roadmap completo de 12 meses
- `ARQUITETURA-BACKEND.md` - Arquitetura e schemas SQL
- `STATUS-ATUAL.md` - Status atual do projeto
- `INICIO-RAPIDO.md` - Comandos e troubleshooting

### **Referências externas:**
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices)

## ⚡ Atalhos Úteis

```bash
# Criar novo módulo completo
alias nest-module='npx nest g module modules/$1 && npx nest g service modules/$1 && npx nest g resolver modules/$1'

# Resetar tudo
alias reset-db='cd apps/api && npx prisma migrate reset'

# Ver logs
alias logs-api='docker logs -f lavra-postgres'
alias logs-db='docker logs -f lavra-postgres'

# Prisma Studio
alias db-studio='cd apps/api && npx prisma studio'
```

## 🎯 Metas Semanais Sugeridas

### **Semana 3 (Atual)**
- [ ] Implementar módulo Plots completo
- [ ] Implementar módulo Plantings
- [ ] Testes unitários (>70% coverage)
- [ ] Conectar com frontend

### **Semana 4**
- [ ] Módulo ClimateData
- [ ] Módulo Alerts
- [ ] WebSockets para alertas em tempo real
- [ ] Testes E2E

### **Semana 5-8 (Mês 2)**
- [ ] Microserviço Climate (Go)
- [ ] Integração APIs externas
- [ ] Worker de alertas
- [ ] Dashboard funcional

---

**🚀 Você está pronto para continuar o desenvolvimento sozinho!**

Siga este guia passo a passo e consulte a documentação sempre que necessário.

**Boa sorte! 🎉**
