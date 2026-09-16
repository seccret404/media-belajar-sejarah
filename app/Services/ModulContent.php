<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class ModulContent
{
    /**
     * @return array<int, array{urutan: int, judul: string, tujuan_pembelajaran: list<string>, pertanyaan_pemantik: string, sections: list<array{judul: string, konten: string}>}>
     */
    public static function all(): array
    {
        static $content = null;

        if ($content === null) {
            $path = resource_path('data/modul-materi.json');

            $content = File::exists($path)
                ? json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR)
                : [];
        }

        return $content;
    }

    /**
     * @return array{urutan: int, judul: string, tujuan_pembelajaran: list<string>, pertanyaan_pemantik: string, sections: list<array{judul: string, konten: string}>}|null
     */
    public static function forUrutan(int $urutan): ?array
    {
        foreach (self::all() as $modul) {
            if ($modul['urutan'] === $urutan) {
                return $modul;
            }
        }

        return null;
    }
}
