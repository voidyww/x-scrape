# Use the official Node image
FROM mcr.microsoft.com/playwright:v1.43.0-jammy

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package.json .
RUN npm install

# Copy your source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
