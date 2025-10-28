FROM node:18-alpine
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# If you built frontend artifacts locally, copy them into the image
# Expecting frontend build at ../frontend/dist
COPY ../frontend/dist ./frontend/dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
