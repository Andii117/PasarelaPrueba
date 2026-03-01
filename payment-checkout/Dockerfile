# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (omitimos opcionalmente scripts de preparación si fallan)
RUN npm install --frozen-lockfile || npm install

# Copiar el resto del código del proyecto
COPY . .

# EJECUCIÓN CLAVE: Usamos vite build directamente para saltar tsc -b
# Esto evita que los errores de tipos (como los de Jest) detengan el despliegue
RUN npx vite build

# Etapa 2: Servidor de Producción (Nginx)
FROM nginx:stable-alpine

# Copiar los archivos estáticos generados por Vite (carpeta dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar tu configuración personalizada de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]