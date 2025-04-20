#!/bin/bash

# Start MySQL properly (fixes "unrecognized service" error)
if [ ! -d "/var/lib/mysql/mysql" ]; then
    mysql_install_db --user=mysql --ldata=/var/lib/mysql
fi

service mariadb start

# Wait for MySQL to be ready
while ! mysqladmin ping -hlocalhost --silent; do
    sleep 1
done

# Configure database
mysql -e "CREATE DATABASE IF NOT EXISTS collectible_haven;" \
      -e "CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '';" \
      -e "GRANT ALL PRIVILEGES ON collectible_haven.* TO 'root'@'localhost';" \
      -e "FLUSH PRIVILEGES;"

# Run migrations
cd /var/www/collectible_haven
php artisan migrate --force

# Start cron
service cron start

# Start Laravel development server
composer run dev --host=0.0.0.0 --port=8000

