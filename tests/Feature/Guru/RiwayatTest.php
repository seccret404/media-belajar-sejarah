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

    public function test_guru_sees_one_row_per_student_and_modul(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create(['nama_modul' => 'Modul A']);
        $kuis = Kuis::factory()->create(['id_modul' => $modul->id]);

        $budi = User::factory()->siswa(2023)->create(['name' => 'Budi']);

        HistoryUser::factory()->create([
            'id_user' => $budi->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => 90,
        ]);

        $response = $this->actingAs($guru)->get(route('guru.riwayat.index'));
        $response->assertOk();

        $riwayat = $response->inertiaProps('riwayat');
        $this->assertCount(1, $riwayat);
        $this->assertSame('Budi', $riwayat[0]['nama']);
        $this->assertSame('Modul A', $riwayat[0]['modul']);
        $this->assertSame(90, $riwayat[0]['skor']);
    }

    public function test_guru_can_filter_riwayat_with_a_single_search_field(): void
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

        // search by name
        $response = $this->actingAs($guru)->get(route('guru.riwayat.index').'?search=Budi');
        $names = collect($response->inertiaProps('riwayat'))->pluck('nama');
        $this->assertTrue($names->contains('Budi'));
        $this->assertFalse($names->contains('Sari'));

        // the same field also searches angkatan
        $response = $this->actingAs($guru)->get(route('guru.riwayat.index').'?search=2024');
        $names = collect($response->inertiaProps('riwayat'))->pluck('nama');
        $this->assertTrue($names->contains('Sari'));
        $this->assertFalse($names->contains('Budi'));
    }
}
