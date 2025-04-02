# Dockerfile

FROM mcr.microsoft.com/playwright:v1.43.0-jammy

WORKDIR /app

COPY package.json ./
RUN npm install

# ✅ This is the key fix — install browsers inside the container
RUN npx playwright install --with-deps

COPY . .

EXPOSE 10000

CMD ["node", "index.js"]
