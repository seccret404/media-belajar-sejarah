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
            'skor' => 16,
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

    public function test_ungraded_submission_hides_skor_but_still_shows_ai_feedback(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        $kuis = Kuis::factory()->create(['id_modul' => $modul->id]);

        HistoryUser::factory()->create([
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => null,
            'review_ai' => 'Feedback AI untuk bahan pertimbangan siswa.',
        ]);

        $index = $this->actingAs($siswa)->get(route('siswa.riwayat.index'));
        $modulProp = collect($index->inertiaProps('modul'))->firstWhere('id', $modul->id);

        $this->assertSame('menunggu', $modulProp['status']);
        $this->assertNull($modulProp['skor']);

        $show = $this->actingAs($siswa)->get(route('siswa.riwayat.show', $modul));
        $review = $show->inertiaProps('review');

        $this->assertNull($review[0]['skor']);
        $this->assertSame('Feedback AI untuk bahan pertimbangan siswa.', $review[0]['review_ai']);
    }
}
