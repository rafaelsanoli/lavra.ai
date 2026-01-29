# Dockerfile para Next.js Frontend
FROM node:20-alpine AS development

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
