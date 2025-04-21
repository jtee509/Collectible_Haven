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

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y npm

# Install Nginx
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'

# Run Composer install
composer install

# Run NPM install
npm install

# Copy .env.example to .env
cp .env.example .env

# Run Laravel migrations and generate application key
php artisan migrate
php artisan key:generate
php artisan storage:link

# Create or update the Nginx configuration file for Laravel
NGINX_CONF="/etc/nginx/sites-available/collectible_haven.conf"
sudo bash -c "cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name collecthaven.test;
    root /home/\$USER/Collectible_haven/public;  # Updated path for Laravel
    index index.php index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;  # Laravel routing
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;  # Deny access to .htaccess files
    }

    error_log /var/log/nginx/collectible_haven_error.log;
    access_log /var/log/nginx/collectible_haven_access.log;
}
EOF"

# Create a symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/collectible_haven.conf /etc/nginx/sites-enabled/

# Optional: Add entry to /etc/hosts for collecthaven.test
echo "127.0.0.1 collecthaven.test" | sudo tee -a /etc/hosts

# Test Nginx configuration
sudo nginx -t

# Reload Nginx to apply changes
sudo systemctl reload nginx

echo "Setup completed successfully!"