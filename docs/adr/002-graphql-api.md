# ADR-002: GraphQL para API

**Status**: Aceito  
**Data**: 29/01/2026  
**Autor**: Staff Engineering Team  

## Contexto

Precisávamos definir o contrato de API entre frontend e backend que:
- Permita frontend buscar apenas dados necessários
- Evite overfetching e underfetching
- Tenha tipagem forte
- Facilite evolução do schema sem breaking changes
- Suporte subscriptions para real-time (alertas)

### Alternativas Consideradas

1. **REST API** (JSON)
   - ✅ Simples e amplamente conhecido
   - ✅ Caching HTTP padrão
   - ❌ Múltiplos endpoints (n+1 requests)
   - ❌ Overfetching/underfetching
   - ❌ Versionamento complexo

2. **gRPC**
   - ✅ Performance superior (Protocol Buffers)
   - ✅ Type-safe
   - ❌ Não suportado em browsers diretamente
   - ❌ Requer código gerado
   - ❌ Menos flexível para frontend web

3. **GraphQL** ⭐
   - ✅ Single endpoint
   - ✅ Cliente define estrutura de resposta
   - ✅ Type system forte
   - ✅ Introspection e docs automáticas
   - ✅ Subscriptions para real-time
   - ✅ Evolução sem versioning
   - ❌ Complexidade de caching
   - ❌ Overhead de parsing
   - ❌ Possível N+1 queries (mitigável com DataLoader)

## Decisão

**Escolhemos GraphQL** com Apollo Server.

### Justificativa

1. **Frontend Flexibility**: Next.js pode buscar exatamente os dados que precisa
2. **Type Safety**: Schema GraphQL gera types TypeScript
3. **Developer Experience**: GraphQL Playground para testar
4. **Real-time**: Subscriptions para alertas críticos
5. **Mobile-Friendly**: Reduz tráfego de dados
6. **Evolução**: Adicionar campos sem breaking changes

### Arquitetura

```
┌─────────────┐
│  Next.js    │
│  (Apollo    │
│   Client)   │
└──────┬──────┘
       │ GraphQL Query/Mutation
       ▼
┌─────────────────┐
│  NestJS API     │
│  (Apollo Server)│
│                 │
│  ┌───────────┐  │
│  │ Resolvers │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ Services  │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │  Prisma   │  │
│  └───────────┘  │
└─────────────────┘
```

## Consequências

### Positivas

- ✅ Frontend pode experimentar sem mudanças no backend
- ✅ Documentação gerada automaticamente
- ✅ Ferramenta de debug (Playground) incluída
- ✅ Facilita BFF (Backend for Frontend) pattern
- ✅ Apollo Client tem cache inteligente

### Negativas

- ❌ Caching HTTP complexo (não pode usar cache de navegador direto)
- ❌ Pode ter N+1 queries sem otimização
- ❌ Overhead de parsing em requests grandes
- ❌ Curva de aprendizado para equipe

### Mitigações

1. **N+1 Queries**: Implementar DataLoader quando necessário
2. **Caching**: Apollo Client cache + Redis para queries frequentes
3. **Performance**: Pagination obrigatória em listas
4. **Rate Limiting**: Implementar por complexidade de query

## Implementação

- [x] Apollo Server integrado com NestJS
- [x] Schema code-first com decorators
- [x] Playground habilitado em dev
- [ ] DataLoader para otimizações
- [ ] Subscription para alertas (próxima sprint)
- [ ] Query complexity analysis

## Métricas de Sucesso

- Latência p95 < 500ms em queries complexas
- Frontend busca média de 3 campos a menos que REST equivalente
- Zero breaking changes em 6 meses

## Referências

- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)

## Revisão

Revisão em **3 meses** para avaliar:
- Performance real em produção
- Complexidade de manutenção
- Necessidade de REST endpoints complementares
