# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the frontend app
RUN npm run build

# --- Web server stage ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React production build
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Run NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]