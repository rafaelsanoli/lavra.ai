# 🎭 Frontend Mockado - Lavra.ia Demo

> ⚠️ **ATENÇÃO**: Este é o frontend MOCKADO para demonstração na landing page. NÃO conecta ao backend real.

## 📋 Propósito

Esta aplicação é uma **versão de demonstração** do Lavra.ai com dados mockados para:
- Demonstrações para investidores
- Apresentações comerciais
- Preview das funcionalidades na landing page
- Testes de UX/UI sem necessidade do backend

## 🔒 O que NÃO faz

- ❌ Não conecta ao backend real
- ❌ Não salva dados permanentemente
- ❌ Não faz cálculos reais
- ❌ Não integra com APIs externas

## ✅ O que faz

- ✅ Demonstra todas as telas e fluxos
- ✅ Usa dados mockados realistas
- ✅ Permite interação completa com a interface
- ✅ Simula autenticação (dados no localStorage)
- ✅ Funciona 100% no navegador

## 🚀 Como executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📂 Estrutura

Mesma estrutura do frontend principal, porém:
- Todos os dados vêm de `/src/lib/mock-data/`
- Não há integração com backend
- AuthStore usa localStorage

## 🔄 Relação com o Frontend Principal

- **apps/demo-web**: Versão mockada (esta pasta)
- **apps/web**: Versão que será conectada ao backend real (em desenvolvimento)

## 📝 Nota

Quando o backend estiver pronto, o frontend em `apps/web` será integrado com APIs reais, enquanto esta versão permanecerá como demo estática.
