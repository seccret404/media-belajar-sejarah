<?php

namespace App\Services\Grading;

use App\Models\Kuis;

interface GradingService
{
    /**
     * Compare a student's essay answer against the teacher's expected
     * answer and answer key, returning a short constructive feedback
     * note. This does not produce a score — a guru decides the final
     * skor themselves after reading the feedback.
     */
    public function grade(Kuis $kuis, string $jawabanSiswa): GradingResult;
}
