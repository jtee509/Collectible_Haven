![alt text](https://github.com/jtee509/Collectible_Haven/blob/main/documentation/Logo.png?raw=true "Logo")

# Collectible Haven

## Overview
Collectible Haven is a Laravel-based web application designed for collectors to manage, showcase, and trade their collectible items. This application provides an intuitive interface with user authentication, product management, and marketplace features.

## Project Structure

### Key Screens

#### User authentication screen

![alt text](https://github.com/jtee509/Collectible_Haven/blob/main/documentation/Login.png?raw=true "Login")

#### New user registration form

![alt text](https://github.com/jtee509/Collectible_Haven/blob/main/documentation/Register.png?raw=true "Register")

####  Browse and search collectibles

![alt text](https://github.com/jtee509/Collectible_Haven/blob/main/documentation/Main%20Marketplace.png?raw=true "Marketplace")

#### Detailed view of individual collectibles

![alt text](https://github.com/jtee509/Collectible_Haven/blob/main/documentation/Product%20Page.png?raw=true "Product Page")

#### Interface for managing collectible items

![alt text](https://github.com/jtee509/Collectible_Haven/blob/main/documentation/Product%20Edit.png?raw=true "Product Edit")


## Prerequisites
- Docker (Do not require for manual installation)
- PHP >= 8.3
- Composer 
- Xampp or MariaDB
- Node.js (for frontend assets)

## Installation

### Option 1: Docker Setup (Recommended)
1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables
3. Run:
```bash
docker-compose up -d --build
```
4. After containers are running, execute:
```bash
docker-compose exec app composer install
docker-compose exec app npm install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --seed
```

### Option 2: Manual Setup
1. Clone the repository 
2. Install dependencies:
```bash
composer install
npm install
```
3. Configure `.env` file:
```bash
cp .env.example .env
```
4. Generate application key:
```bash
php artisan key:generate
```
5. Run migrations:
```bash
php artisan migrate
```
#### Testing run
Run a pre loaded data for testing the file:
```bash
php artisan db:seed
```

## Environment Variables
### Ensure that you have the following Xampp installed 
`.env` configurations within the database looks like this uncheck `#` if you want to modify it
```env
DB_CONNECTION=mariadb
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=collectible_haven
# DB_USERNAME=root
# DB_PASSWORD=
```

## Running the Application

### Development
```bash
# Start Laravel development server
composer run dev
```
Once run the databse the url should be :
```bash
http://localhost:8000
```
