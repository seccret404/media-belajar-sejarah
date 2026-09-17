<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use App\Models\Modul;
use App\Services\Grading\GradingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KuisController extends Controller
{
    protected const int JUMLAH_SOAL = 5;

    public function create(Modul $modul): Response|RedirectResponse
    {
        $userId = (int) Auth::id();

        $rows = $this->attemptRows($userId, $modul);

        if ($rows->isNotEmpty()) {
            if ($rows->contains(fn (HistoryUser $row) => $row->jawaban !== null)) {
                return redirect()->route('siswa.modul.show', $modul);
            }
        } else {
            $kuisIds = $modul->kuis()->inRandomOrder()->limit(self::JUMLAH_SOAL)->pluck('id');

            foreach ($kuisIds as $kuisId) {
                HistoryUser::create([
                    'id_user' => $userId,
                    'id_modul' => $modul->id,
                    'id_kuis' => $kuisId,
                ]);
            }

            $rows = $this->attemptRows($userId, $modul);
        }

        return Inertia::render('siswa/kuis-take', [
            'modul' => $modul->only(['id', 'nama_modul']),
            'soal' => $rows->map(fn (HistoryUser $row) => [
                'id' => $row->kuis->id,
                'soal' => $row->kuis->soal,
            ])->values(),
        ]);
    }

    public function store(Request $request, Modul $modul, GradingService $gradingService): RedirectResponse
    {
        $userId = (int) Auth::id();
        $rows = $this->attemptRows($userId, $modul);

        abort_if($rows->isEmpty(), 409, 'Kuis belum diambil. Silakan ambil kuis kembali.');
        abort_if(
            $rows->contains(fn (HistoryUser $row) => $row->jawaban !== null),
            409,
            'Kuis ini sudah dikumpulkan sebelumnya.',
        );

        $validated = $request->validate([
            'jawaban' => ['nullable', 'array'],
            'jawaban.*' => ['nullable', 'string'],
        ]);

        /** @var array<int, string|null> $jawabanInput */
        $jawabanInput = $validated['jawaban'] ?? [];
        $jawaban = collect($jawabanInput);

        // Grade every answer before opening a transaction: AI grading calls
        // an external service and can be slow, so we don't want to hold a
        // database transaction open for the duration of several HTTP calls.
        $hasilPerBaris = $rows->map(function (HistoryUser $row) use ($jawaban, $gradingService) {
            $jawabanSiswa = (string) $jawaban->get($row->id_kuis, '');

            return [
                'row' => $row,
                'jawaban' => $jawabanSiswa,
                'hasil' => $gradingService->grade($row->kuis, $jawabanSiswa),
            ];
        });

        DB::transaction(function () use ($hasilPerBaris) {
            foreach ($hasilPerBaris as $item) {
                $item['row']->update([
                    'jawaban' => $item['jawaban'],
                    'skor' => $item['hasil']->skor,
                    'review_ai' => $item['hasil']->review,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kuis berhasil dikumpulkan.']);

        return redirect()->route('siswa.modul.show', $modul);
    }

    /**
     * @return Collection<int, HistoryUser>
     */
    protected function attemptRows(int $userId, Modul $modul): Collection
    {
        return HistoryUser::query()
            ->where('id_user', $userId)
            ->where('id_modul', $modul->id)
            ->orderBy('id')
            ->with('kuis')
            ->get();
    }
}
