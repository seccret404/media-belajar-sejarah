<?php

namespace Database\Factories;

use App\Models\Modul;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Modul>
 */
class ModulFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        /** @var list<string> $paragraphs */
        $paragraphs = fake()->paragraphs(5);

        return [
            'nama_modul' => 'Modul '.fake()->unique()->randomLetter(),
            'urutan' => fake()->unique()->numberBetween(1, 8),
            'konten' => implode("\n\n", $paragraphs),
        ];
    }
}
