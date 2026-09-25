FROM php:8.4-cli-alpine

# System packages + PHP extensions Laravel needs, plus Node (for the
# Vite/React build and the Wayfinder route-generation step, which shells
# out to `php artisan` and therefore needs vendor/ already installed).
RUN apk add --no-cache \
        git curl unzip libzip-dev icu-dev oniguruma-dev nodejs npm \
    && docker-php-ext-install pdo pdo_mysql mbstring zip intl bcmath opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN npm ci && npm run build && rm -rf node_modules

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

EXPOSE 8080

CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"]
