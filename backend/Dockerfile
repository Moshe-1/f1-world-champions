FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including Prisma
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest
COPY . .

# Building the project
RUN npm run build

# Executes from /app
CMD ["node", "dist/index.js"]