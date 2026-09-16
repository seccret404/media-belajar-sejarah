<?php

namespace App\Services\Grading;

use App\Models\Kuis;

/**
 * Placeholder grading service used until AI-based grading is wired up.
 * Every answer is left at a score of 0 with a note that it is awaiting review.
 */
class PendingGradingService implements GradingService
{
    public function grade(Kuis $kuis, string $jawabanSiswa): GradingResult
    {
        return new GradingResult(
            skor: 0,
            review: 'Penilaian AI belum diaktifkan. Jawaban ini menunggu penilaian.',
        );
    }
}
