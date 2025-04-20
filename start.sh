#!/bin/bash

# Start MySQL
service mysql start

# Configure database
mysql -e "CREATE DATABASE IF NOT EXISTS collectible_haven;"
mysql -e "CREATE USER IF NOT EXISTS 'collectible_user'@'localhost' IDENTIFIED BY 'test';"
mysql -e "GRANT ALL PRIVILEGES ON collectible_haven.* TO 'collectible_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Run migrations (optional)
cd /var/www/collectible_haven
php artisan migrate --force

# Start Laravel development server
php artisan serve --host=0.0.0.0 --port=8000