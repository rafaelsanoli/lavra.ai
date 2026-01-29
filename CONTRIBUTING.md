# 🤝 Guia de Contribuição - Lavra.ia

Obrigado por considerar contribuir com o Lavra.ia! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Development](#processo-de-development)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testes](#testes)
- [Documentação](#documentação)

## 📜 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### Reportar Bugs

1. **Verifique** se o bug já não foi reportado
2. **Use** o template de issue para bugs
3. **Inclua**:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (OS, Node version, etc)

### Sugerir Features

1. **Verifique** a roadmap e issues existentes
2. **Descreva** claramente o problema que resolve
3. **Explique** como a feature funcionaria
4. **Considere** alternativas

### Contribuir com Código

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Faça suas mudanças
4. Teste localmente
5. Commit (`git commit -m 'feat: adiciona MinhaFeature'`)
6. Push (`git push origin feature/MinhaFeature`)
7. Abra um Pull Request

## 💻 Padrões de Código

### TypeScript/NestJS

```typescript
/**
 * Service responsável por gerenciar fazendas.
 * 
 * @class FarmsService
 * @example
 * const farm = await farmsService.create(userId, createFarmDto);
 */
@Injectable()
export class FarmsService {
  /**
   * Cria uma nova fazenda para o usuário.
   * 
   * @param userId - ID do usuário proprietário
   * @param createFarmInput - Dados da fazenda
   * @returns Promise com a fazenda criada
   * @throws {NotFoundException} Se usuário não existe
   */
  async create(userId: string, createFarmInput: CreateFarmInput): Promise<Farm> {
    // Validar usuário existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Criar fazenda
    return this.prisma.farm.create({
      data: {
        ...createFarmInput,
        userId,
      },
      include: {
        plots: true,
      },
    });
  }
}
```

### Regras de Estilo

1. **Nomes**:
   - Classes: `PascalCase`
   - Métodos/Variáveis: `camelCase`
   - Constantes: `UPPER_SNAKE_CASE`
   - Arquivos: `kebab-case.ts`

2. **Imports**:
   ```typescript
   // 1. Node modules
   import { Injectable } from '@nestjs/common';
   
   // 2. Projeto (absoluto)
   import { PrismaService } from '@/prisma/prisma.service';
   
   // 3. Relativo (mesma feature)
   import { CreateFarmInput } from './dto/create-farm.input';
   ```

3. **Estrutura de Arquivo**:
   ```typescript
   // Imports
   // Interfaces/Types
   // Constants
   // Class
   // Methods (public -> private)
   // Exports
   ```

4. **Comentários**:
   - Use JSDoc para funções públicas
   - Comente o "porquê", não o "o quê"
   - Evite comentários óbvios

### Estrutura de Módulos

```
modules/
└── nome-modulo/
    ├── dto/
    │   ├── create-nome.input.ts
    │   └── update-nome.input.ts
    ├── entities/
    │   └── nome.entity.ts
    ├── tests/
    │   ├── nome.service.spec.ts
    │   └── nome.resolver.spec.ts
    ├── nome.module.ts
    ├── nome.service.ts
    └── nome.resolver.ts
```

## 🔄 Processo de Development

### 1. Setup Local

```bash
# Clone
git clone https://github.com/seu-usuario/lavra.ai.git
cd lavra.ai

# Instalar dependências
cd apps/api && npm install

# Setup banco
docker compose up -d postgres redis
npx prisma migrate dev

# Rodar
npm run start:dev
```

### 2. Criar Feature Branch

```bash
# Atualizar main
git checkout main
git pull origin main

# Criar branch
git checkout -b feature/nome-da-feature

# Ou para bugfix
git checkout -b fix/nome-do-bug
```

### 3. Desenvolver

```bash
# Fazer mudanças
# Testar localmente

# Verificar qualidade
npm run lint
npm run test
npm run test:e2e
```

### 4. Commit

Siga [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "tipo: descrição curta"
```

**Tipos**:
- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Mudanças em documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração
- `test`: Adicionar/corrigir testes
- `chore`: Manutenção (deps, config)
- `perf`: Melhorias de performance

**Exemplos**:
```
feat: adiciona módulo de plantings
fix: corrige cálculo de área em farms
docs: atualiza README com novos endpoints
refactor: extrai lógica de validação para helper
test: adiciona testes para auth service
```

### 5. Push e PR

```bash
# Push
git push origin feature/nome-da-feature

# Abrir PR no GitHub
# Seguir template de PR
```

## 🔀 Pull Request Process

### Checklist do PR

- [ ] Código segue os padrões do projeto
- [ ] Testes passando (`npm run test`)
- [ ] Testes E2E passando (se aplicável)
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] Sem console.logs ou debuggers
- [ ] Sem conflitos com main
- [ ] Build passando (`npm run build`)

### Template de PR

```markdown
## 📝 Descrição
Breve descrição do que foi feito

## 🎯 Motivação
Por que essa mudança é necessária?

## 🔧 Mudanças
- Mudança 1
- Mudança 2

## 📸 Screenshots
(se aplicável)

## ✅ Checklist
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Build passando
- [ ] Self-review feito

## 🔗 Issues Relacionadas
Closes #123
```

### Code Review

Após abrir PR:
1. CI/CD rodará testes automaticamente
2. Ao menos 1 aprovação necessária
3. Responda aos comentários
4. Atualize conforme feedback
5. Squash commits se necessário

## 🧪 Testes

### Testes Unitários

```typescript
describe('FarmsService', () => {
  let service: FarmsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: PrismaService,
          useValue: {
            farm: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('deve criar uma fazenda', async () => {
      const createDto = { name: 'Fazenda Teste', /* ... */ };
      const expected = { id: '1', ...createDto };

      jest.spyOn(prisma.farm, 'create').mockResolvedValue(expected as any);

      const result = await service.create('user-123', createDto);

      expect(result).toEqual(expected);
      expect(prisma.farm.create).toHaveBeenCalled();
    });
  });
});
```

### Rodar Testes

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E
npm run test:e2e
```

### Cobertura Mínima

- **Global**: 80%
- **Services**: 90%
- **Controllers/Resolvers**: 70%

## 📚 Documentação

### O que documentar

1. **Código**:
   - JSDoc em funções públicas
   - Comentários para lógica complexa
   - README em módulos complexos

2. **API**:
   - GraphQL schema auto-documentado
   - Exemplos de queries/mutations
   - Casos de erro

3. **Arquitetura**:
   - ADRs para decisões importantes
   - Diagramas quando necessário
   - Fluxos críticos

### Atualizar Documentação

- `README.md` - Para mudanças gerais
- `docs/` - Documentação técnica
- `CHANGELOG.md` - Todas mudanças
- ADRs - Decisões arquiteturais

## 🤔 Dúvidas?

- Leia a documentação em `/docs`
- Consulte issues existentes
- Pergunte no Discord/Slack
- Abra uma issue de discussão

## 🎉 Agradecimentos

Toda contribuição é valorizada! Obrigado por ajudar a melhorar o Lavra.ia.

---

**Happy Coding! 🚀🌾**
