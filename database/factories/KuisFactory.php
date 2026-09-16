<?php

namespace Database\Factories;

use App\Models\Kuis;
use App\Models\Modul;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kuis>
 */
class KuisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        /** @var list<string> $words */
        $words = fake()->words(5);

        return [
            'id_modul' => Modul::factory(),
            'soal' => fake()->sentence(10).'?',
            'jawaban_ekspektasi' => fake()->paragraph(),
            'key_jawaban' => implode(', ', $words),
        ];
    }
}
