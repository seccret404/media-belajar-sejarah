<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\Modul;
use App\Services\Grading\GradingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        $sudahDikerjakan = HistoryUser::query()
            ->where('id_user', $userId)
            ->where('id_modul', $modul->id)
            ->exists();

        if ($sudahDikerjakan) {
            return redirect()->route('siswa.modul.show', $modul);
        }

        $sessionKey = $this->sessionKey($modul, $userId);
        $soalIds = session($sessionKey);

        if (! $soalIds) {
            $soalIds = $modul->kuis()->inRandomOrder()->limit(self::JUMLAH_SOAL)->pluck('id')->all();
            session([$sessionKey => $soalIds]);
        }

        $soal = Kuis::query()
            ->whereIn('id', $soalIds)
            ->get(['id', 'soal'])
            ->sortBy(fn (Kuis $kuis) => array_search($kuis->id, $soalIds));

        return Inertia::render('siswa/kuis-take', [
            'modul' => $modul->only(['id', 'nama_modul']),
            'soal' => $soal->values(),
        ]);
    }

    public function store(Request $request, Modul $modul, GradingService $gradingService): RedirectResponse
    {
        $userId = (int) Auth::id();
        $sessionKey = $this->sessionKey($modul, $userId);
        $soalIds = session($sessionKey, []);

        abort_if(empty($soalIds), 409, 'Sesi kuis tidak ditemukan. Silakan ambil kuis kembali.');

        $validated = $request->validate([
            'jawaban' => ['nullable', 'array'],
            'jawaban.*' => ['nullable', 'string'],
        ]);
        /** @var array<int, string|null> $jawabanInput */
        $jawabanInput = $validated['jawaban'] ?? [];
        $jawaban = collect($jawabanInput);

        DB::transaction(function () use ($soalIds, $jawaban, $modul, $userId, $gradingService) {
            $soalList = Kuis::whereIn('id', $soalIds)->get()->keyBy('id');

            foreach ($soalIds as $kuisId) {
                $kuis = $soalList->get($kuisId);

                if (! $kuis) {
                    continue;
                }

                $jawabanSiswa = (string) $jawaban->get($kuisId, '');
                $hasil = $gradingService->grade($kuis, $jawabanSiswa);

                HistoryUser::updateOrCreate(
                    ['id_user' => $userId, 'id_kuis' => $kuisId],
                    [
                        'id_modul' => $modul->id,
                        'jawaban' => $jawabanSiswa,
                        'skor' => $hasil->skor,
                        'review_ai' => $hasil->review,
                    ],
                );
            }
        });

        session()->forget($sessionKey);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kuis berhasil dikumpulkan.']);

        return redirect()->route('siswa.modul.show', $modul);
    }

    protected function sessionKey(Modul $modul, int $userId): string
    {
        return "kuis_attempt.{$userId}.{$modul->id}";
    }
}
