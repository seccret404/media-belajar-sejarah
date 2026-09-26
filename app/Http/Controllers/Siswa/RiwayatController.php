<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use App\Models\Modul;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function index(): Response
    {
        $userId = (int) Auth::id();

        $modul = Modul::query()
            ->whereHas('historyUser', fn ($query) => $query
                ->where('id_user', $userId)
                ->whereNotNull('jawaban'),
            )
            ->with(['historyUser' => fn ($query) => $query
                ->where('id_user', $userId)
                ->whereNotNull('jawaban'),
            ])
            ->orderBy('urutan')
            ->get()
            ->map(function (Modul $modul) {
                $sudahDinilai = $modul->historyUser->every(fn (HistoryUser $h) => $h->skor !== null);

                return [
                    'id' => $modul->id,
                    'nama_modul' => $modul->nama_modul,
                    'urutan' => $modul->urutan,
                    'jumlah_soal' => $modul->historyUser->count(),
                    'status' => $sudahDinilai ? 'selesai' : 'menunggu',
                    'skor' => $sudahDinilai ? $modul->historyUser->sum('skor') : null,
                ];
            })
            ->values();

        return Inertia::render('siswa/riwayat-index', [
            'modul' => $modul,
        ]);
    }

    public function show(Modul $modul): Response
    {
        $userId = (int) Auth::id();

        $review = HistoryUser::query()
            ->where('id_user', $userId)
            ->where('id_modul', $modul->id)
            ->whereNotNull('jawaban')
            ->with('kuis')
            ->orderBy('id')
            ->get()
            ->map(fn (HistoryUser $history) => [
                'soal' => $history->kuis->soal,
                'jawaban' => $history->jawaban,
                'skor' => $history->skor,
                'review_ai' => $history->review_ai,
            ]);

        abort_if($review->isEmpty(), 404);

        return Inertia::render('siswa/riwayat-show', [
            'modul' => $modul->only(['id', 'nama_modul', 'urutan']),
            'review' => $review,
        ]);
    }
}
