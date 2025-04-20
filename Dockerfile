# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    nginx \
    nodejs \
    npm \
    cron \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Add PHP 8.3 repository and install PHP
RUN add-apt-repository ppa:ondrej/php -y && \
    apt-get update && \
    apt-get install -y \
    php8.3 \
    php8.3-fpm \
    php8.3-mysql \
    php8.3-mbstring \
    php8.3-xml \
    php8.3-zip \
    php8.3-gd \
    php8.3-bcmath \
    php8.3-pdo

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Clone the repository
RUN git clone https://github.com/jtee509/Collectible_haven /var/www/collectible_haven

# Set working directory
WORKDIR /var/www/collectible_haven

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Install NPM dependencies
RUN npm install && npm run build

# Configure Nginx and PHP-FPM
COPY ./collectible_haven.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/collectible_haven.conf /etc/nginx/sites-enabled/ \
    && rm /etc/nginx/sites-enabled/default \
    && mkdir -p /run/php \
    && chown -R www-data:www-data /var/www/collectible_haven/storage \
    && chown -R www-data:www-data /var/www/collectible_haven/bootstrap/cache

# Copy environment file and generate key
RUN cp .env.example .env \
    && php artisan key:generate

# Set up auto-updates with cron
RUN echo "* * * * * cd /var/www/collectible_haven && git fetch --all && git reset --hard origin/main && composer install --no-interaction --optimize-autoloader --no-dev && npm install && npm run build && php artisan migrate --force" >> /etc/cron.d/collectible_haven-auto-update \
    && chmod 0644 /etc/cron.d/collectible_haven-auto-update \
    && crontab /etc/cron.d/collectible_haven-auto-update

# Expose ports
EXPOSE 80 8000

# Start services
CMD service cron start && \
    service php8.3-fpm start && \
    php artisan migrate --force && \
    nginx -g "daemon off;"