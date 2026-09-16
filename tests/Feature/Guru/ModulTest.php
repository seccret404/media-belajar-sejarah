<?php

namespace Tests\Feature\Guru;

use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModulTest extends TestCase
{
    use RefreshDatabase;

    public function test_siswa_cannot_access_guru_modul_pages(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();

        $this->actingAs($siswa)
            ->get(route('guru.modul.index'))
            ->assertForbidden();

        $this->actingAs($siswa)
            ->get(route('guru.modul.show', $modul))
            ->assertForbidden();
    }

    public function test_guru_can_view_modul_index_and_show(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(3)->create(['id_modul' => $modul->id]);

        $this->actingAs($guru)
            ->get(route('guru.modul.index'))
            ->assertOk();

        $this->actingAs($guru)
            ->get(route('guru.modul.show', $modul))
            ->assertOk();
    }

    public function test_guru_can_create_update_and_remove_soal(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        $existing = Kuis::factory()->create(['id_modul' => $modul->id]);
        $toDelete = Kuis::factory()->create(['id_modul' => $modul->id]);

        $this->actingAs($guru)->put(route('guru.modul.update', $modul), [
            'soal' => [
                [
                    'id' => $existing->id,
                    'soal' => 'Soal yang diperbarui?',
                    'jawaban_ekspektasi' => 'Jawaban baru',
                    'key_jawaban' => 'kunci, baru',
                ],
                [
                    'soal' => 'Soal baru?',
                    'jawaban_ekspektasi' => 'Jawaban',
                    'key_jawaban' => 'kunci',
                ],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('kuis', [
            'id' => $existing->id,
            'soal' => 'Soal yang diperbarui?',
        ]);
        $this->assertDatabaseMissing('kuis', ['id' => $toDelete->id]);
        $this->assertDatabaseCount('kuis', 2);
    }

    public function test_guru_cannot_remove_soal_that_already_has_history(): void
    {
        $guru = User::factory()->guru()->create();
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        $answered = Kuis::factory()->create(['id_modul' => $modul->id]);

        HistoryUser::factory()->create([
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'id_kuis' => $answered->id,
        ]);

        $this->actingAs($guru)->put(route('guru.modul.update', $modul), [
            'soal' => [],
        ])->assertRedirect();

        $this->assertDatabaseHas('kuis', ['id' => $answered->id]);
    }
}
