<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\HistoryUser;
use App\Models\Modul;
use App\Services\ModulContent;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ModulController extends Controller
{
    public function index(): Response
    {
        $userId = Auth::id();

        $selesaiModulIds = HistoryUser::query()
            ->where('id_user', $userId)
            ->whereNotNull('jawaban')
            ->distinct()
            ->pluck('id_modul');

        $modul = Modul::query()
            ->orderBy('urutan')
            ->get()
            ->map(fn (Modul $modul) => [
                'id' => $modul->id,
                'nama_modul' => $modul->nama_modul,
                'urutan' => $modul->urutan,
                'selesai' => $selesaiModulIds->contains($modul->id),
            ]);

        return Inertia::render('siswa/modul-index', [
            'modul' => $modul,
        ]);
    }

    public function show(Modul $modul): Response
    {
        $userId = Auth::id();

        $history = HistoryUser::query()
            ->where('id_user', $userId)
            ->where('id_modul', $modul->id)
            ->whereNotNull('jawaban')
            ->with('kuis')
            ->orderBy('id')
            ->get()
            ->map(fn (HistoryUser $history) => [
                'soal' => $history->kuis->soal,
                'jawaban' => $history->jawaban,
                // skor stays null until a guru reads the AI feedback and
                // sets the final grade; the feedback itself is visible to
                // the student right away.
                'skor' => $history->skor,
                'review_ai' => $history->review_ai,
            ]);

        $materi = ModulContent::forUrutan($modul->urutan);

        return Inertia::render('siswa/modul-show', [
            'modul' => [
                ...$modul->only(['id', 'nama_modul', 'urutan']),
                'tujuan_pembelajaran' => $materi['tujuan_pembelajaran'] ?? [],
                'pertanyaan_pemantik' => $materi['pertanyaan_pemantik'] ?? null,
                'sections' => $materi['sections'] ?? [],
            ],
            'selesai' => $history->isNotEmpty(),
            'review' => $history,
        ]);
    }
}
