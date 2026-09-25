<?php

namespace App\Services\Grading;

use App\Models\Kuis;

/**
 * Placeholder grading service used until AI-based feedback is wired up.
 * Every answer gets a note that it is awaiting review.
 */
class PendingGradingService implements GradingService
{
    public function grade(Kuis $kuis, string $jawabanSiswa): GradingResult
    {
        return new GradingResult(
            review: 'Penilaian AI belum diaktifkan. Jawaban ini menunggu penilaian.',
        );
    }
}
