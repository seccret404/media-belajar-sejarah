<?php

namespace Tests\Feature\Guru;

use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RiwayatTest extends TestCase
{
    use RefreshDatabase;

    public function test_guru_can_filter_riwayat_by_nama_and_angkatan(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        $kuis = Kuis::factory()->create(['id_modul' => $modul->id]);

        $budi = User::factory()->siswa(2023)->create(['name' => 'Budi']);
        $sari = User::factory()->siswa(2024)->create(['name' => 'Sari']);

        HistoryUser::factory()->create([
            'id_user' => $budi->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => 90,
        ]);

        HistoryUser::factory()->create([
            'id_user' => $sari->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => 70,
        ]);

        $response = $this->actingAs($guru)->get(
            route('guru.riwayat.show', $modul).'?search=Budi',
        );

        $names = collect($response->inertiaProps('siswa'))->pluck('nama');
        $this->assertTrue($names->contains('Budi'));
        $this->assertFalse($names->contains('Sari'));

        $response = $this->actingAs($guru)->get(
            route('guru.riwayat.show', $modul).'?angkatan=2024',
        );

        $names = collect($response->inertiaProps('siswa'))->pluck('nama');
        $this->assertTrue($names->contains('Sari'));
        $this->assertFalse($names->contains('Budi'));
    }
}
