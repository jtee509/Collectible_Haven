#!/bin/bash

# Update package list and install necessary packages
sudo apt update
sudo apt upgrade -y

# Install PHP 8.3 and required extensions
sudo apt install -y software-properties-common
sudo apt update
sudo apt install -y php php-cli php-fpm php-mysql php-xml php-mbstring php-curl php-zip php-bcmath

# Install Composer
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
sudo php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer

# Install MariaDB
sudo apt install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Variables
MYSQL_ROOT_PASSWORD=""  # Replace with your MySQL root password

# Grant all privileges to root user
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION; FLUSH PRIVILEGES;"

echo "All privileges granted to root user."

# Secure MariaDB installation (you may want to customize this)
sudo mysql_secure_installation

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y npm

# Run Composer install
composer install

# Run NPM install
npm install

# Copy .env.example to .env
cp .env.example .env

php artisan migrate
php artisan key:generate
php artisan 

# Optional: Add entry to /etc/hosts for collecthaven.test
echo "127.0.0.1 collecthaven.test" | sudo tee -a /etc/hosts

echo "Setup completed successfully!"