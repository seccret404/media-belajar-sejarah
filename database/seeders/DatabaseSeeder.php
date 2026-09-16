<?php

namespace Database\Seeders;

use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use App\Services\ModulContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->guru()->create([
            'name' => 'Guru Sejarah',
            'email' => 'guru@example.com',
        ]);

        User::factory()->siswa(now()->year)->create([
            'name' => 'Siswa Contoh',
            'email' => 'siswa@example.com',
        ]);

        foreach (ModulContent::all() as $materi) {
            $modul = Modul::factory()->create([
                'nama_modul' => $materi['judul'],
                'urutan' => $materi['urutan'],
            ]);

            Kuis::factory(8)->create([
                'id_modul' => $modul->id,
            ]);
        }
    }
}
