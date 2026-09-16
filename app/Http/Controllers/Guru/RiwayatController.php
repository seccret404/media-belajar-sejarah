<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $riwayat = HistoryUser::query()
            ->whereNotNull('jawaban')
            ->whereHas('user', fn ($query) => $query->where('role', 'siswa'))
            ->when($search !== '', fn ($query) => $query->whereHas('user', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('angkatan', 'like', "%{$search}%");
            }))
            ->with(['user', 'modul', 'kuis'])
            ->get()
            ->groupBy(fn (HistoryUser $history) => "{$history->id_user}-{$history->id_modul}")
            ->map(function ($group) {
                /** @var HistoryUser $first */
                $first = $group->first();

                return [
                    'id' => "{$first->id_user}-{$first->id_modul}",
                    'nama' => $first->user->name,
                    'angkatan' => $first->user->angkatan,
                    'modul' => $first->modul->nama_modul,
                    'urutan' => $first->modul->urutan,
                    'skor' => (int) round($group->avg('skor')),
                    'detail' => $group->map(fn (HistoryUser $history) => [
                        'soal' => $history->kuis->soal,
                        'jawaban' => $history->jawaban,
                        'skor' => $history->skor,
                        'review_ai' => $history->review_ai,
                    ])->values(),
                ];
            })
            ->sortBy([['nama', 'asc'], ['urutan', 'asc']])
            ->values();

        return Inertia::render('guru/riwayat-index', [
            'riwayat' => $riwayat,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
