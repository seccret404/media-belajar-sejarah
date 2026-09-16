<?php

namespace Database\Seeders;

use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use App\Services\ModulContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

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

        /** @var list<array{urutan: int, soal: list<array{soal: string, jawaban_ekspektasi: string, key_jawaban: string}>}> $evaluasi */
        $evaluasi = json_decode(File::get(resource_path('data/kuis-evaluasi.json')), true);
        $evaluasiByUrutan = collect($evaluasi)->keyBy('urutan');

        foreach (ModulContent::all() as $materi) {
            $modul = Modul::factory()->create([
                'nama_modul' => $materi['judul'],
                'urutan' => $materi['urutan'],
            ]);

            $soal = $evaluasiByUrutan->get($materi['urutan'])['soal'] ?? [];

            foreach ($soal as $item) {
                Kuis::create([
                    'id_modul' => $modul->id,
                    'soal' => $item['soal'],
                    'jawaban_ekspektasi' => $item['jawaban_ekspektasi'],
                    'key_jawaban' => $item['key_jawaban'],
                ]);
            }
        }
    }
}
