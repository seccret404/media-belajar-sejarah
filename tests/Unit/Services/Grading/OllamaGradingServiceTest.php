<?php

namespace Tests\Unit\Services\Grading;

use App\Models\Kuis;
use App\Services\Grading\OllamaGradingService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OllamaGradingServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.ollama.url', 'https://ollama.test/api/chat');
        Config::set('services.ollama.key', 'test-key');
        Config::set('services.ollama.model', 'test-model');
    }

    protected function kuis(): Kuis
    {
        return new Kuis([
            'soal' => 'Apa pengertian sejarah?',
            'jawaban_ekspektasi' => 'Ilmu tentang peristiwa masa lalu.',
            'key_jawaban' => "- masa lalu\n- peristiwa",
        ]);
    }

    public function test_returns_the_reviews_plain_text_on_success(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response([
                'message' => ['content' => 'Jawaban kamu sudah cukup tepat, coba tambahkan contoh.'],
            ]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Sejarah adalah ilmu masa lalu.');

        $this->assertSame('Jawaban kamu sudah cukup tepat, coba tambahkan contoh.', $hasil->review);
    }

    public function test_strips_wrapping_quotes_and_markdown_fences(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response([
                'message' => ['content' => "```\n\"Kamu sudah menjawab dengan baik.\"\n```"],
            ]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertSame('Kamu sudah menjawab dengan baik.', $hasil->review);
    }

    public function test_falls_back_when_response_is_empty(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response(['message' => ['content' => '']]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertSame(
            'Penilaian otomatis gagal diproses. Jawaban ini perlu ditinjau ulang oleh guru.',
            $hasil->review,
        );
    }

    public function test_falls_back_when_http_request_fails(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response(['error' => 'boom'], 500),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertNotEmpty($hasil->review);
    }
}
