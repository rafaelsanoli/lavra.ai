-- Script de inicialização do banco de dados
-- Executado automaticamente no primeiro start do PostgreSQL

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Confirmar criação
SELECT 'Database initialized successfully' AS status;
