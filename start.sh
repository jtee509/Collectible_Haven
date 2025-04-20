#!/bin/bash

# Start services
service mysql start
service php8.3-fpm start
service cron start

# Configure MySQL
mysql -e "CREATE DATABASE IF NOT EXISTS collectible_haven;"
mysql -e "CREATE USER IF NOT EXISTS 'collectible_user'@'localhost' IDENTIFIED BY 'test';"
mysql -e "GRANT ALL PRIVILEGES ON collectible_haven.* TO 'collectible_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Start npm run dev
cd /var/www/collectible_haven
npm run dev &  # Run in background

# Start nginx (this will keep the container running)
exec nginx -g "daemon off;"