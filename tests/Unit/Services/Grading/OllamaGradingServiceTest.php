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

    public function test_returns_parsed_score_and_review_on_success(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response([
                'message' => [
                    'content' => json_encode(['skor' => 85, 'review' => 'Jawaban cukup baik.']),
                ],
            ]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Sejarah adalah ilmu masa lalu.');

        $this->assertSame(85, $hasil->skor);
        $this->assertSame('Jawaban cukup baik.', $hasil->review);
    }

    public function test_clamps_score_outside_zero_to_hundred(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response([
                'message' => [
                    'content' => json_encode(['skor' => 150, 'review' => 'Sempurna.']),
                ],
            ]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertSame(100, $hasil->skor);
    }

    public function test_extracts_json_surrounded_by_extra_text(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response([
                'message' => [
                    'content' => "Here is the result:\n{\"skor\": 70, \"review\": \"Lumayan.\"}\nThanks.",
                ],
            ]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertSame(70, $hasil->skor);
        $this->assertSame('Lumayan.', $hasil->review);
    }

    public function test_falls_back_when_response_is_not_valid_json(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response([
                'message' => ['content' => 'bukan json sama sekali'],
            ]),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertSame(0, $hasil->skor);
        $this->assertNotEmpty($hasil->review);
    }

    public function test_falls_back_when_http_request_fails(): void
    {
        Http::fake([
            'ollama.test/*' => Http::response(['error' => 'boom'], 500),
        ]);

        $hasil = (new OllamaGradingService)->grade($this->kuis(), 'Jawaban.');

        $this->assertSame(0, $hasil->skor);
        $this->assertNotEmpty($hasil->review);
    }
}
