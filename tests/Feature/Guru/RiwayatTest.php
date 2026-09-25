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
        $this->assertSame('selesai', $riwayat[0]['status']);
        $this->assertSame(90, $riwayat[0]['skor']);
    }

    public function test_ungraded_submission_shows_as_menunggu_with_a_null_skor(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        $kuis = Kuis::factory()->create(['id_modul' => $modul->id]);
        $siswa = User::factory()->siswa()->create();

        HistoryUser::factory()->create([
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => null,
        ]);

        $response = $this->actingAs($guru)->get(route('guru.riwayat.index'));
        $riwayat = $response->inertiaProps('riwayat');

        $this->assertSame('menunggu', $riwayat[0]['status']);
        $this->assertNull($riwayat[0]['skor']);
    }

    public function test_guru_can_input_skor_for_an_ungraded_submission(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        $kuis = Kuis::factory()->create(['id_modul' => $modul->id]);
        $siswa = User::factory()->siswa()->create();

        $history = HistoryUser::factory()->create([
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => null,
        ]);

        $response = $this->actingAs($guru)->put(
            route('guru.riwayat.update', [$siswa->id, $modul->id]),
            ['skor' => [$kuis->id => 85]],
        );

        $response->assertSessionHasNoErrors()->assertRedirect();
        $this->assertSame(85, $history->fresh()->skor);
    }

    public function test_guru_can_update_a_skor_that_is_already_final(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        $kuis = Kuis::factory()->create(['id_modul' => $modul->id]);
        $siswa = User::factory()->siswa()->create();

        $history = HistoryUser::factory()->create([
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'id_kuis' => $kuis->id,
            'skor' => 70,
        ]);

        $response = $this->actingAs($guru)->put(
            route('guru.riwayat.update', [$siswa->id, $modul->id]),
            ['skor' => [$kuis->id => 40]],
        );

        $response->assertSessionHasNoErrors()->assertRedirect();
        $this->assertSame(40, $history->fresh()->skor);
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
