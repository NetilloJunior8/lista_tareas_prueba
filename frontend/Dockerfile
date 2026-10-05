# ---- Etapa 1: construir el sitio estático ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# que no afectan al funcionamiento. Ver explicación en la guía.
RUN npx vite build

#  Etapa 2: servirlo con Nginx 
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
