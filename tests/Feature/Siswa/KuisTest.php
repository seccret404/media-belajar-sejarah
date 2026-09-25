<?php

namespace Tests\Feature\Siswa;

use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KuisTest extends TestCase
{
    use RefreshDatabase;

    public function test_guru_cannot_access_siswa_kuis_pages(): void
    {
        $guru = User::factory()->guru()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(5)->create(['id_modul' => $modul->id]);

        $this->actingAs($guru)
            ->get(route('siswa.modul.index'))
            ->assertForbidden();
    }

    public function test_siswa_can_take_and_submit_a_quiz(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        $soal = Kuis::factory(8)->create(['id_modul' => $modul->id]);

        $take = $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));
        $take->assertOk();

        $soalProp = $take->inertiaProps('soal');
        $this->assertCount(5, $soalProp);

        $jawaban = collect($soalProp)->mapWithKeys(
            fn ($item) => [$item['id'] => "Jawaban untuk soal {$item['id']}"],
        )->all();

        $this->actingAs($siswa)
            ->post(route('siswa.kuis.store', $modul), ['jawaban' => $jawaban])
            ->assertRedirect(route('siswa.modul.show', $modul));

        $this->assertDatabaseCount('history_user', 5);
        $this->assertDatabaseHas('history_user', [
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
        ]);
    }

    public function test_soal_assignment_is_randomized_once_and_persists(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(15)->create(['id_modul' => $modul->id]);

        $first = $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));
        $second = $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));

        $firstIds = collect($first->inertiaProps('soal'))->pluck('id');
        $secondIds = collect($second->inertiaProps('soal'))->pluck('id');

        $this->assertCount(5, $firstIds);
        $this->assertSame($firstIds->all(), $secondIds->all());
        $this->assertDatabaseCount('history_user', 5);
        $this->assertDatabaseHas('history_user', [
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'jawaban' => null,
            'skor' => null,
        ]);
    }

    public function test_siswa_cannot_retake_a_completed_quiz(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(5)->create(['id_modul' => $modul->id]);

        $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));
        $this->actingAs($siswa)->post(route('siswa.kuis.store', $modul), [
            'jawaban' => [],
        ]);

        $this->actingAs($siswa)
            ->get(route('siswa.kuis.create', $modul))
            ->assertRedirect(route('siswa.modul.show', $modul));
    }

    public function test_cannot_submit_a_quiz_twice(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(5)->create(['id_modul' => $modul->id]);

        $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));
        $this->actingAs($siswa)->post(route('siswa.kuis.store', $modul), ['jawaban' => []]);

        $this->actingAs($siswa)
            ->post(route('siswa.kuis.store', $modul), ['jawaban' => []])
            ->assertStatus(409);
    }

    public function test_submitting_a_quiz_records_ai_feedback_but_leaves_skor_for_the_guru(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(5)->create(['id_modul' => $modul->id]);

        $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));
        $this->actingAs($siswa)->post(route('siswa.kuis.store', $modul), [
            'jawaban' => [],
        ]);

        $this->assertDatabaseHas('history_user', [
            'id_user' => $siswa->id,
            'id_modul' => $modul->id,
            'skor' => null,
        ]);

        $row = HistoryUser::query()
            ->where('id_user', $siswa->id)
            ->where('id_modul', $modul->id)
            ->first();

        $this->assertNotNull($row->review_ai);
        $this->assertNull($row->skor);
    }

    public function test_modul_show_reports_completion_and_review(): void
    {
        $siswa = User::factory()->siswa()->create();
        $modul = Modul::factory()->create();
        Kuis::factory(5)->create(['id_modul' => $modul->id]);

        $before = $this->actingAs($siswa)->get(route('siswa.modul.show', $modul));
        $this->assertFalse($before->inertiaProps('selesai'));

        $this->actingAs($siswa)->get(route('siswa.kuis.create', $modul));
        $this->actingAs($siswa)->post(route('siswa.kuis.store', $modul), [
            'jawaban' => [],
        ]);

        $after = $this->actingAs($siswa)->get(route('siswa.modul.show', $modul));
        $this->assertTrue($after->inertiaProps('selesai'));
        $this->assertCount(5, $after->inertiaProps('review'));
    }
}
