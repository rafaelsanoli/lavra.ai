# ADR-001: NestJS como Framework Backend

**Status**: Aceito  
**Data**: 29/01/2026  
**Autor**: Staff Engineering Team  
**Decisores**: Tech Lead

## Contexto

Precisávamos escolher um framework backend que:
- Suporte TypeScript nativamente
- Tenha arquitetura escalável e modular
- Integre bem com GraphQL
- Tenha boa documentação e comunidade
- Suporte dependency injection
- Facilite testes automatizados

### Alternativas Consideradas

1. **Express.js** (Node.js puro)
   - ✅ Leve e flexível
   - ❌ Sem estrutura opinativa
   - ❌ Configuração manual complexa
   - ❌ Difícil manter consistência em time

2. **Fastify**
   - ✅ Performance superior
   - ❌ Ecossistema menor
   - ❌ Menos recursos nativos
   - ❌ Curva de aprendizado

3. **NestJS** ⭐
   - ✅ Arquitetura modular (inspirada em Angular)
   - ✅ TypeScript first-class
   - ✅ Dependency Injection nativo
   - ✅ Decorators para clean code
   - ✅ GraphQL integration excelente
   - ✅ Testing utilities incluídas
   - ✅ CLI poderosa para scaffolding
   - ❌ Overhead de bundle size
   - ❌ Curva de aprendizado inicial

## Decisão

**Escolhemos NestJS** como framework backend principal.

### Justificativa

1. **Arquitetura Escalável**: Sistema de módulos facilita crescimento do projeto
2. **TypeScript Nativo**: Type safety em toda aplicação
3. **DI Container**: Facilita testes e inversão de dependências
4. **GraphQL First-Class**: Decorators para schema-first ou code-first
5. **Ecosystem**: Suporte a Prisma, JWT, WebSockets, Queue, Cache
6. **Documentação**: Excelente docs e large community
7. **Testing**: Jest integrado + utilities de teste

## Consequências

### Positivas

- ✅ Código mais organizado e maintainable
- ✅ Onboarding de devs mais rápido (estrutura clara)
- ✅ Facilita implementação de patterns (Repository, Service, etc)
- ✅ Hot reload em desenvolvimento
- ✅ CLI para gerar boilerplate (`nest g`)

### Negativas

- ❌ Bundle size maior que Express puro (~500KB vs ~100KB)
- ❌ Overhead de abstrações em projetos muito simples
- ❌ Requer entendimento de decorators e DI

### Riscos Mitigados

- **Vendor Lock-in**: Moderado. NestJS é abstração sobre Express/Fastify
- **Performance**: Adequada para 10k+ req/s (suficiente para MVP)
- **Learning Curve**: Mitigado com docs internas e pair programming

## Implementação

- [x] NestJS v10 instalado
- [x] Estrutura modular criada
- [x] GraphQL configurado
- [x] Prisma integrado
- [x] JWT auth implementado

## Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Best Practices](https://github.com/nestjs/nest/tree/master/sample)
- [Benchmark NestJS vs Express](https://medium.com/deno-the-complete-reference/oak-vs-express-js-performance-comparison-c3b065c2423d)

## Revisão

Esta decisão será revisada em **6 meses** (Julho/2026) ou se:
- Performance se tornar gargalo crítico
- Equipe crescer e necessitar linguagem compilada (Go, Rust)
- Microserviços demandarem framework diferente
