<?php

namespace Tests\Feature\Siswa;

use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RiwayatTest extends TestCase
{
    use RefreshDatabase;

    public function test_riwayat_index_only_lists_completed_modul(): void
    {
        $siswa = User::factory()->siswa()->create();
        $selesai = Modul::factory()->create();
        $belum = Modul::factory()->create();
        $kuis = Kuis::factory()->create(['id_modul' => $selesai->id]);

        HistoryUser::factory()->create([
            'id_user' => $siswa->id,
            'id_modul' => $selesai->id,
            'id_kuis' => $kuis->id,
            'skor' => 80,
        ]);

        $response = $this->actingAs($siswa)->get(route('siswa.riwayat.index'));
        $response->assertOk();

        $modulProp = $response->inertiaProps('modul');
        $ids = collect($modulProp)->pluck('id');

        $this->assertTrue($ids->contains($selesai->id));
        $this->assertFalse($ids->contains($belum->id));
    }

    public function test_riwayat_show_is_not_found_for_untouched_modul(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();

        $this->actingAs($siswa)
            ->get(route('siswa.riwayat.show', $modul))
            ->assertNotFound();
    }
}
