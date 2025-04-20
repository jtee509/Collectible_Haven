#!/bin/bash

# Update package list and install necessary packages
sudo apt update
sudo apt upgrade -y

# Install PHP 8.3 and required extensions
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip

# Install Composer
curl -sS https://getcomposer.org/installer | php8.3 -- --install-dir=/usr/local/bin --filename=composer

# Install MariaDB
sudo apt install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure MariaDB installation (you may want to customize this)
sudo mysql_secure_installation

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Allow HTTP and HTTPS traffic through the firewall
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Run Composer install
composer install

# Run NPM install
npm install

# Copy .env.example to .env
cp .env.example .env

# Generate application key, run migrations, and create storage link
php artisan key:generate
php artisan migrate
php artisan storage:link

# Copy Nginx configuration file
sudo cp collectible_haven.conf /etc/nginx/sites-available/collectible_haven.conf

# Create a symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/collectible_haven.conf /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx to apply changes
sudo systemctl restart nginx

# Optional: Add entry to /etc/hosts for collecthaven.test
echo "127.0.0.1 collecthaven.test" | sudo tee -a /etc/hosts

echo "Setup completed successfully!"