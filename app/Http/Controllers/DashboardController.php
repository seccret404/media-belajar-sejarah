<?php

namespace App\Http\Controllers;

use App\Models\HistoryUser;
use App\Models\Kuis;
use App\Models\Modul;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return $user->isGuru()
            ? Inertia::render('guru/dashboard', $this->guruStats())
            : Inertia::render('siswa/dashboard', $this->siswaStats($user));
    }

    /**
     * @return array<string, mixed>
     */
    protected function guruStats(): array
    {
        $modul = Modul::query()->orderBy('urutan')->get();

        /** @var Collection<string, Collection<int, HistoryUser>> $selesai */
        $selesai = HistoryUser::query()
            ->whereNotNull('jawaban')
            ->whereHas('user', fn ($query) => $query->where('role', 'siswa'))
            ->with(['user:id,name', 'modul:id,nama_modul'])
            ->get()
            ->groupBy(fn (HistoryUser $history) => "{$history->id_user}-{$history->id_modul}");

        $rataRataSkor = $selesai->isEmpty()
            ? 0
            : (int) round($selesai->flatten()->avg('skor'));

        $skorPerModul = $modul->map(function (Modul $m) use ($selesai) {
            $attempts = $selesai->filter(fn (Collection $g) => $g->first()->id_modul === $m->id);

            return [
                'nama_modul' => $m->nama_modul,
                'rata_rata' => $attempts->isEmpty()
                    ? null
                    : (int) round($attempts->map(fn (Collection $g) => $g->avg('skor'))->avg()),
                'jumlah_siswa' => $attempts->count(),
            ];
        })->values();

        $aktivitasTerbaru = $selesai
            ->map(fn (Collection $g) => [
                'nama' => $g->first()->user->name,
                'modul' => $g->first()->modul->nama_modul,
                'skor' => (int) round($g->avg('skor')),
                'waktu' => $g->max('updated_at'),
            ])
            ->sortByDesc('waktu')
            ->take(6)
            ->map(fn (array $item) => [
                ...$item,
                'waktu' => Carbon::parse($item['waktu'])->diffForHumans(),
            ])
            ->values();

        return [
            'totalModul' => $modul->count(),
            'totalSoal' => Kuis::count(),
            'totalSiswaAktif' => $selesai->map(fn (Collection $g) => $g->first()->id_user)->unique()->count(),
            'rataRataSkor' => $rataRataSkor,
            'skorPerModul' => $skorPerModul,
            'aktivitasTerbaru' => $aktivitasTerbaru,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function siswaStats(User $user): array
    {
        $modul = Modul::query()->orderBy('urutan')->get();

        /** @var Collection<int, Collection<int, HistoryUser>> $selesai */
        $selesai = HistoryUser::query()
            ->where('id_user', $user->id)
            ->whereNotNull('jawaban')
            ->get()
            ->groupBy('id_modul');

        $rataRataSkor = $selesai->isEmpty()
            ? 0
            : (int) round($selesai->flatten()->avg('skor'));

        $skorPerModul = $modul->map(function (Modul $m) use ($selesai) {
            $attempt = $selesai->get($m->id);

            return [
                'nama_modul' => $m->nama_modul,
                'skor' => $attempt ? (int) round($attempt->avg('skor')) : null,
            ];
        })->values();

        $modulBerikutnya = $modul->first(fn (Modul $m) => ! $selesai->has($m->id));

        return [
            'totalModul' => $modul->count(),
            'modulSelesai' => $selesai->count(),
            'rataRataSkor' => $rataRataSkor,
            'skorPerModul' => $skorPerModul,
            'modulBerikutnya' => $modulBerikutnya ? $modulBerikutnya->only(['id', 'nama_modul']) : null,
        ];
    }
}
