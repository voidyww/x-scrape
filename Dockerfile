FROM mcr.microsoft.com/playwright:v1.43.0-jammy

WORKDIR /app

COPY package.json ./
RUN npm install

# 🔧 Install the Playwright browsers (Chromium, Firefox, WebKit)
RUN npx playwright install --with-deps

COPY . .

EXPOSE 10000

CMD ["node", "index.js"]
