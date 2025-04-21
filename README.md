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
- PHP >= 8.3
- Composer 
- Xampp or MariaDB
- Node.js (for frontend assets)

## Installation

### Manual Setup
1. Clone the repository 
2. Run the command and press enter:
```bash
sudo apt update && sudo apt install mariadb-server -y && sudo mysqld_safe --skip-grant-tables &
```
3. Enter mysql command, press enter and there is no password:
```bash
sudo mysql -u root -p ''
```

4. Run following mysql command :
```bash
CREATE DATABASE collectible_haven;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');
EXIT;
```
5. Restart Mariadb Server:
```bash
sudo systemctl restart mariadb
```
6. Run migrations:
```bash
cd Collectible_haven
sudo chmod +x ./startup.sh && ./startup.sh
```
#### Testing run
Run a pre loaded data for testing the file:
```bash
php artisan db:seed
```

#### Optional Choice (Domain Testing)
1. Install Nginx:
```bash
sudo apt install -y nginx && sudo ufw allow 'Nginx Full' 
```
2. Modify the collectible_haven.conf to your path :
```bash
sudo nano collectible_haven.conf
```
3. Create a symbolic link to enable the site
```bash
sudo ln -s /etc/nginx/sites-available/collectible_haven.conf /etc/nginx/sites-enabled/
```
4. Verify Nginx Configuration:
```bash
sudo nginx -t && sudo systemctl reload nginx && sudo ufw disable && sudo ufw enable
```
5. Optional: Add entry to /etc/hosts for collecthaven.test
```bash
sudo tee -a /etc/hosts
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
