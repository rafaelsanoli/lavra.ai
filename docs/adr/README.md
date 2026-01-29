# Architecture Decision Records (ADRs)

Este diretório contém as decisões arquiteturais tomadas durante o desenvolvimento do Lavra.ia.

## O que são ADRs?

ADRs documentam decisões importantes de arquitetura, incluindo:
- Contexto da decisão
- Decisão tomada
- Consequências (positivas e negativas)
- Alternativas consideradas

## Formato

Cada ADR segue o template:
- **Status**: Proposto | Aceito | Deprecated | Superseded
- **Contexto**: Por que precisamos tomar essa decisão?
- **Decisão**: O que decidimos fazer?
- **Consequências**: Quais os impactos?

## Lista de ADRs

1. [ADR-001: NestJS como Framework Backend](./001-nestjs-backend.md)
2. [ADR-002: GraphQL para API](./002-graphql-api.md)
3. [ADR-003: Prisma como ORM](./003-prisma-orm.md)
4. [ADR-004: Microserviços em Go](./004-go-microservices.md)
5. [ADR-005: Arquitetura de Autenticação JWT](./005-jwt-auth.md)

## Como adicionar um novo ADR

```bash
# Copiar template
cp docs/adr/template.md docs/adr/00X-nome-da-decisao.md

# Editar com sua decisão
# Adicionar na lista acima
```
