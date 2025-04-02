# Use official Playwright base image with all system dependencies
FROM mcr.microsoft.com/playwright:v1.43.0-jammy 
WORKDIR /app

# Copy package files and install Node.js dependencies (including Playwright)
COPY package.json package-lock.json ./ 
RUN npm install

# **Install Playwright browsers** (Chromium, etc.) in the image
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Expose the port (optional, for documentation)
EXPOSE 10000

# Start the application
CMD ["node", "index.js"]
