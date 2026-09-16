<?php

namespace App\Services\Grading;

use App\Models\Kuis;

interface GradingService
{
    /**
     * Grade a student's essay answer against the teacher's expected
     * answer and answer key, returning a score (0-100) and review text.
     */
    public function grade(Kuis $kuis, string $jawabanSiswa): GradingResult;
}
