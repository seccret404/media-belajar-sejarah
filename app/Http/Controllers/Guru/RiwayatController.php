<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                $sudahDinilai = $group->every(fn (HistoryUser $h) => $h->skor !== null);

                return [
                    'id' => "{$first->id_user}-{$first->id_modul}",
                    'id_user' => $first->id_user,
                    'id_modul' => $first->id_modul,
                    'nama' => $first->user->name,
                    'angkatan' => $first->user->angkatan,
                    'modul' => $first->modul->nama_modul,
                    'urutan' => $first->modul->urutan,
                    'status' => $sudahDinilai ? 'selesai' : 'menunggu',
                    'skor' => $sudahDinilai ? $group->sum('skor') : null,
                    'detail' => $group->map(fn (HistoryUser $history) => [
                        'id_kuis' => $history->id_kuis,
                        'soal' => $history->kuis->soal,
                        'jawaban' => $history->jawaban,
                        'skor' => $history->skor,
                        'review_ai' => $history->review_ai,
                    ])->values(),
                ];
            })
            ->sortBy(fn (array $item) => [
                $item['status'] === 'menunggu' ? 0 : 1,
                $item['nama'],
                $item['urutan'],
            ])
            ->values();

        return Inertia::render('guru/riwayat-index', [
            'riwayat' => $riwayat,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function update(Request $request, int $idUser, int $idModul): RedirectResponse
    {
        // Each soal is worth at most 20 points; a modul's final skor is the
        // sum of all of its soal (5 soal x 20 = 100).
        $validated = $request->validate([
            'skor' => ['required', 'array', 'min:1'],
            'skor.*' => ['required', 'integer', 'min:0', 'max:20'],
        ]);

        // Guru can add or revise a skor at any time, even after a
        // submission was already fully graded.
        $rows = HistoryUser::query()
            ->where('id_user', $idUser)
            ->where('id_modul', $idModul)
            ->whereNotNull('jawaban')
            ->whereIn('id_kuis', array_keys($validated['skor']))
            ->get();

        abort_if($rows->isEmpty(), 404);

        DB::transaction(function () use ($rows, $validated) {
            foreach ($rows as $row) {
                $row->update(['skor' => $validated['skor'][$row->id_kuis]]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Skor berhasil disimpan.']);

        return back();
    }
}
