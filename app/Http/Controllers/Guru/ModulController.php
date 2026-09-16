<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Modul;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModulController extends Controller
{
    public function index(): Response
    {
        $modul = Modul::withCount('kuis')->orderBy('urutan')->get();

        return Inertia::render('guru/modul-index', [
            'modul' => $modul,
        ]);
    }

    public function show(Modul $modul): Response
    {
        $modul->load([
            'kuis' => fn ($query) => $query
                ->withCount(['historyUser' => fn ($query) => $query->whereNotNull('jawaban')])
                ->orderBy('id'),
        ]);

        return Inertia::render('guru/modul-show', [
            'modul' => $modul,
        ]);
    }

    public function update(Request $request, Modul $modul): RedirectResponse
    {
        $validated = $request->validate([
            'soal' => ['array'],
            'soal.*.id' => ['nullable', 'integer', 'exists:kuis,id'],
            'soal.*.soal' => ['required', 'string'],
            'soal.*.jawaban_ekspektasi' => ['required', 'string'],
            'soal.*.key_jawaban' => ['required', 'string'],
        ]);

        /** @var list<array{id?: int, soal: string, jawaban_ekspektasi: string, key_jawaban: string}> $soal */
        $soal = $validated['soal'] ?? [];
        $submitted = collect($soal);
        $submittedIds = $submitted->pluck('id')->filter()->all();

        $modul->kuis()
            ->whereNotIn('id', $submittedIds)
            ->whereDoesntHave('historyUser')
            ->delete();

        foreach ($submitted as $item) {
            $attributes = [
                'soal' => $item['soal'],
                'jawaban_ekspektasi' => $item['jawaban_ekspektasi'],
                'key_jawaban' => $item['key_jawaban'],
            ];

            if (! empty($item['id'])) {
                $modul->kuis()->whereKey($item['id'])->update($attributes);
            } else {
                $modul->kuis()->create($attributes);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Soal kuis berhasil disimpan.']);

        return back();
    }
}
