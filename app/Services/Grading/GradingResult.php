<?php

namespace App\Services\Grading;

class GradingResult
{
    public function __construct(
        public readonly int $skor,
        public readonly string $review,
    ) {}
}
