<?php

namespace App\Services\Grading;

use App\Models\Kuis;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Writes feedback on a student's essay answer by asking a hosted Ollama
 * model to compare it against the teacher's expected answer and answer
 * key. It does not grade — a guru reads this feedback and decides the
 * final skor themselves.
 */
class OllamaGradingService implements GradingService
{
    public function grade(Kuis $kuis, string $jawabanSiswa): GradingResult
    {
        try {
            $response = Http::withToken((string) config('services.ollama.key'))
                ->timeout(60)
                ->retry(2, 500)
                ->post((string) config('services.ollama.url'), [
                    'model' => config('services.ollama.model'),
                    'stream' => false,
                    'messages' => [
                        ['role' => 'system', 'content' => $this->systemPrompt()],
                        ['role' => 'user', 'content' => $this->userPrompt($kuis, $jawabanSiswa)],
                    ],
                ])
                ->throw();

            $review = $this->cleanReview((string) data_get($response->json(), 'message.content', ''));

            if ($review !== '') {
                return new GradingResult(review: $review);
            }

            Log::warning('Penilaian AI: respons kosong.');
        } catch (Throwable $e) {
            Log::error('Penilaian AI gagal.', ['error' => $e->getMessage()]);
        }

        return new GradingResult(
            review: 'Penilaian otomatis gagal diproses. Jawaban ini perlu ditinjau ulang oleh guru.',
        );
    }

    protected function systemPrompt(): string
    {
        return <<<'PROMPT'
            Kamu adalah asisten guru sejarah yang membantu memeriksa jawaban esai
            singkat siswa SMA. Bandingkan jawaban siswa dengan jawaban guru dan
            poin-poin kunci yang diharapkan.

            Analisis jawaban berdasarkan dua aspek:
            1. Ketepatan konsep: periksa kesesuaian konsep atau fakta yang
               disampaikan siswa dengan konsep dan fakta pada jawaban guru.
               Identifikasi bagian yang sudah tepat dan bagian yang masih
               mengalami ketidaktepatan konsep.
            2. Kelengkapan jawaban: periksa apakah unsur-unsur penting pada
               jawaban guru atau poin kunci yang diharapkan sudah terdapat
               dalam jawaban siswa. Identifikasi bagian yang sudah lengkap
               dan bagian yang masih perlu ditambahkan.

            Kemudian tulis catatan singkat (1-2 kalimat, berbahasa Indonesia,
            sapa siswa dengan "kamu") yang membangun: sebutkan apa yang sudah
            tepat dan apa yang masih kurang atau bisa ditambahkan.

            Catatan ini HANYA bahan pertimbangan untuk guru - kamu TIDAK
            menentukan skor atau nilai akhir, jadi jangan menyebutkan angka
            skor sama sekali.

            Balas HANYA dengan catatan tersebut sebagai teks polos, tanpa
            JSON, tanpa tanda kutip, dan tanpa embel-embel lain.
            PROMPT;
    }

    protected function userPrompt(Kuis $kuis, string $jawabanSiswa): string
    {
        $jawabanSiswa = trim($jawabanSiswa) !== '' ? $jawabanSiswa : '(siswa tidak menjawab)';

        return <<<PROMPT
            Soal: {$kuis->soal}

            Jawaban guru (referensi): {$kuis->jawaban_ekspektasi}

            Poin kunci yang diharapkan:
            {$kuis->key_jawaban}

            Jawaban siswa: {$jawabanSiswa}
            PROMPT;
    }

    /**
     * Models sometimes ignore the "plain text only" instruction and wrap
     * the note in quotes or a markdown code fence — strip that defensively.
     */
    protected function cleanReview(string $content): string
    {
        $content = trim($content);
        $content = preg_replace('/^```[a-z]*\n?|\n?```$/i', '', $content) ?? $content;
        $content = trim($content, " \t\n\r\0\x0B\"'");

        return trim($content);
    }
}
