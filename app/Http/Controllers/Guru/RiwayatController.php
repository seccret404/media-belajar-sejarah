<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use App\Models\Modul;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function index(): Response
    {
        $modul = Modul::withCount('kuis')->orderBy('urutan')->get();

        return Inertia::render('guru/riwayat-index', [
            'modul' => $modul,
        ]);
    }

    public function show(Request $request, Modul $modul): Response
    {
        $search = $request->string('search')->trim()->toString();
        $angkatan = $request->string('angkatan')->trim()->toString();

        $siswa = User::query()
            ->where('role', 'siswa')
            ->whereHas('historyUser', fn ($query) => $query->where('id_modul', $modul->id))
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when($angkatan !== '', fn ($query) => $query->where('angkatan', $angkatan))
            ->with(['historyUser' => fn ($query) => $query
                ->where('id_modul', $modul->id)
                ->with('kuis')
                ->orderBy('id'),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'nama' => $user->name,
                'angkatan' => $user->angkatan,
                'jumlah_soal' => $user->historyUser->count(),
                'skor' => (int) round($user->historyUser->avg('skor') ?? 0),
                'detail' => $user->historyUser->map(fn (HistoryUser $history) => [
                    'soal' => $history->kuis->soal,
                    'jawaban' => $history->jawaban,
                    'skor' => $history->skor,
                    'review_ai' => $history->review_ai,
                ]),
            ]);

        return Inertia::render('guru/riwayat-show', [
            'modul' => $modul,
            'siswa' => $siswa,
            'filters' => [
                'search' => $search,
                'angkatan' => $angkatan,
            ],
        ]);
    }
}
