# Cómo correr TareasConcredito con Docker

No necesitas XAMPP, ni Java, ni Node, ni crear usuarios en MySQL.
Solo **Docker Desktop** abierto (en Windows debe decir "Engine running").

## 1. Levantar todo

En una terminal, dentro de esta carpeta (donde está `docker-compose.yml`):

    docker compose up --build

La primera vez tarda unos minutos (descarga imágenes y compila el backend y el frontend).
Espera a ver en el log una línea con `Started BackendApplication`.

## 2. Abrir la aplicación

http://localhost:8081

No hay usuarios precargados: pulsa **Crear cuenta**, regístrate y entra.

## 3. Apagar

    docker compose down          # apaga, conserva los datos
    docker compose down -v       # apaga y BORRA la base de datos

## Qué se levanta

| Contenedor      | Qué es                                   | Visible desde fuera |
|-----------------|------------------------------------------|---------------------|
| react-frontend  | React compilado + Nginx (reenvía /api)   | Sí, puerto 8081     |
| spring-backend  | Spring Boot + Spring Security (JWT)      | No (red interna)    |
| mysqldb         | MySQL 8, crea solo la BD y el usuario    | No (red interna)    |

## Si algo falla

- **El puerto 8081 está ocupado:** crea un archivo `.env` con `FRONTEND_PORT=8090` (u otro) y vuelve a correr.
- **Ves 502 Bad Gateway al abrir:** el backend aún está arrancando; espera 30–60 segundos y recarga.
- **Ver errores:** `docker compose logs backend`
- **Cambiaste credenciales y no surten efecto:** MySQL las lee solo la primera vez; corre `docker compose down -v` y levanta de nuevo.
