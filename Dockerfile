# Imagem base
FROM node:18-alpine

# Pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o projeto
COPY . .

# Build do projeto (frontend + backend)
RUN npm run build

# Porta da aplicação
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start"]
