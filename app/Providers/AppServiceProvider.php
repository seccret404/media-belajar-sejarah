<?php

namespace App\Providers;

use App\Services\Grading\GradingService;
use App\Services\Grading\OllamaGradingService;
use App\Services\Grading\PendingGradingService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(GradingService::class, function ($app) {
            if (filled(config('services.ollama.key'))) {
                return $app->make(OllamaGradingService::class);
            }

            return $app->make(PendingGradingService::class);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        // Some MySQL/MariaDB hosts still default to the older InnoDB row
        // format (no innodb_large_prefix), which caps indexed keys at 767
        // bytes — too small for a utf8mb4 varchar(255) unique index. Capping
        // the default migration string length keeps unique/indexed columns
        // (e.g. users.email) under that limit everywhere.
        Schema::defaultStringLength(191);

        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
