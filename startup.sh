#!/bin/bash

# Update package list and install necessary packages
echo "Updating package list and upgrading installed packages..."
sudo apt update
sudo apt upgrade -y

# Install PHP 8.3 and required extensions
echo "Installing PHP 8.3 and required extensions..."
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-bcmath

# Install Composer
echo "Installing Composer..."
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
sudo php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer

# Install Node.js (using NodeSource)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y npm

# Start the MariaDB service normally
echo "Starting MariaDB service..."
sudo systemctl start mariadb

cp .env.example .env

# Run Composer install
echo "Running Composer install..."
composer install

# Run NPM install
echo "Running NPM install..."
npm install

# Copy .env.example to .env if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
fi

# Run Laravel migrations and generate application key
echo "Running Laravel migrations and generating application key..."
php artisan config:cache
php artisan migrate
php artisan key:generate
php artisan storage:link


echo "Setup completed successfully!"