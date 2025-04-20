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
    mariadb-server \
    mariadb-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP 8.3 and required extensions
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
    php8.3-pdo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create directory for the application
WORKDIR /var/www/collectible_haven

# Clone the repository
RUN git clone https://github.com/jtee509/Collectible_Haven . \
    && composer install --no-interaction --prefer-dist \
    && npm install --production

# Configure Nginx
COPY collectible_haven.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/collectible_haven.conf /etc/nginx/sites-enabled/ \
    && rm /etc/nginx/sites-enabled/default \
    && mkdir -p /run/php \
    && chown -R www-data:www-data /var/www/collectible_haven/storage \
    && chown -R www-data:www-data /var/www/collectible_haven/bootstrap/cache

# Configure cron for auto-updates
RUN echo "* * * * * cd /var/www/collectible_haven && git fetch --all && git reset --hard origin/main && composer install --no-interaction --prefer-dist && npm install --production" >> /etc/cron.d/collectible_haven-auto-update \
    && chmod 0644 /etc/cron.d/collectible_haven-auto-update \
    && crontab /etc/cron.d/collectible_haven-auto-update

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80 8000

# Start services
CMD ["/start.sh"]