<?php

namespace Database\Factories;

use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HistoryUser>
 */
class HistoryUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $kuis = Kuis::factory()->create();

        return [
            'id_user' => User::factory()->siswa(),
            'id_modul' => $kuis->id_modul,
            'id_kuis' => $kuis->id,
            'jawaban' => fake()->paragraph(),
            'skor' => fake()->numberBetween(0, 100),
            'review_ai' => fake()->sentence(),
        ];
    }
}
