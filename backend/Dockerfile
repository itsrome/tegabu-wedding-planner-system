FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libsqlite3-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_pgsql \
    && apt-get clean

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create SQLite database as fallback
RUN touch database/database.sqlite

# Cache config
RUN php artisan config:cache || true
RUN php artisan route:cache || true

# Expose port
EXPOSE 8000

# Start command - supports both SQLite and PostgreSQL via DB_CONNECTION env var
CMD php artisan config:clear && php artisan storage:link && php artisan migrate --force && php artisan db:seed --class=VendorSeeder --force && php artisan db:seed --class=AdminSeeder --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
