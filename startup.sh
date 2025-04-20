#!/bin/bash

# Update package list and install necessary packages
sudo apt update
sudo apt upgrade -y

# Install PHP 8.3 and required extensions
sudo apt install -y software-properties-common
sudo apt update
sudo apt install -y php php-cli php-fpm php-mysql php-xml php-mbstring php-curl php-zip php-bcmath

# Install Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

# Install MariaDB
sudo apt install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Run MySQL commands
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Restart MySQL service
sudo service mysql restart

echo "MySQL root user authentication method updated and service restarted."

# Secure MariaDB installation (you may want to customize this)
sudo mysql_secure_installation

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y npm

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