# Dockerfile para NestJS API
FROM node:20-alpine AS development

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
