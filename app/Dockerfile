FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
# Hardening: Chay voi user non-root mac dinh cua node image
USER node
EXPOSE 3000
CMD ["node", "server.js"]
