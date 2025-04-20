#!/bin/bash

# Start MariaDB
service mysql start

# Start PHP-FPM
service php8.3-fpm start

# Start cron
service cron start

# Start nginx
nginx -g "daemon off;"