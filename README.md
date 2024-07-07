# API REST Backend Test

## Descripción

Esta es una API REST desarrollada como prueba técnica para el equipo de backend. La API incluye las siguientes funcionalidades:

- Registro de usuario
- Login de usuario
- Crear un endpoint para usuarios logueados que recibe una ciudad (o coordenadas) y retorna una lista de restaurantes cercanos.
- Crear un endpoint para consultar la lista de transacciones realizadas históricamente.
- Logout de usuario

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Tecnologías

- Node.js
- Express
- MongoDB
- JWT para autenticación
- Docker y Docker Compose

## Instalación y Ejecución
1. Clona este repositorio:

```bash
git clone https://github.com/luiscortesj1/tyba-rest.git
cd tyba-rest

2. Crea un archivo .env en el directorio raíz del proyecto y agrega las siguientes variables de entorno:
GOOGLE_API_KEY=your_google_api_key
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://mongo:27017/databaseName

### 2. Instalar Dependencias
npm install

### 4. Ejecutar Pruebas

Para asegurarte de que todo esté configurado correctamente, ejecuta las pruebas:
npm test

## Docker

### 1. Construir la Imagen de Docker

Para construir la imagen de Docker, ejecuta el siguiente comando:
docker-compose up --build

En la carpeta  postman esta una colección con los enpoint, seria solo impotarlo. 