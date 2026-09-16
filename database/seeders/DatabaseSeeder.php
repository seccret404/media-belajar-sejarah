<?php

namespace Database\Seeders;

use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
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

        $namaModul = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        foreach ($namaModul as $urutan => $huruf) {
            $modul = Modul::factory()->create([
                'nama_modul' => "Modul {$huruf}",
                'urutan' => $urutan + 1,
            ]);

            Kuis::factory(8)->create([
                'id_modul' => $modul->id,
            ]);
        }
    }
}
