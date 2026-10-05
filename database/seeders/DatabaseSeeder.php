<?php

namespace Database\Seeders;

use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use App\Services\ModulContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat User Guru secara manual tanpa Factory
        User::firstOrCreate(
            ['email' => 'guru@example.com'],
            [
                'name' => 'Guru Sejarah',
                'password' => Hash::make('password'),
                'role' => 'guru',
            ]
        );

        // 2. Buat User Siswa secara manual tanpa Factory
        User::firstOrCreate(
            ['email' => 'siswa@example.com'],
            [
                'name' => 'Siswa Contoh',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'angkatan' => now()->year,
            ]
        );

        /** @var list<array{urutan: int, soal: list<array{soal: string, jawaban_ekspektasi: string, key_jawaban: string}>}> $evaluasi */
        $evaluasi = json_decode(File::get(resource_path('data/kuis-evaluasi.json')), true);
        $evaluasiByUrutan = collect($evaluasi)->keyBy('urutan');

        foreach (ModulContent::all() as $materi) {
            // Buat Modul secara manual tanpa Factory
            $modul = Modul::firstOrCreate(
                ['urutan' => $materi['urutan']],
                ['nama_modul' => $materi['judul']]
            );

            $soal = $evaluasiByUrutan->get($materi['urutan'])['soal'] ?? [];

            foreach ($soal as $item) {
                Kuis::firstOrCreate(
                    [
                        'id_modul' => $modul->id,
                        'soal' => $item['soal'],
                    ],
                    [
                        'jawaban_ekspektasi' => $item['jawaban_ekspektasi'],
                        'key_jawaban' => $item['key_jawaban'],
                    ]
                );
            }
        }
    }
}