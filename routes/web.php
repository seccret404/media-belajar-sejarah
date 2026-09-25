<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Guru\ModulController as GuruModulController;
use App\Http\Controllers\Guru\RiwayatController as GuruRiwayatController;
use App\Http\Controllers\Siswa\KuisController as SiswaKuisController;
use App\Http\Controllers\Siswa\ModulController as SiswaModulController;
use App\Http\Controllers\Siswa\RiwayatController as SiswaRiwayatController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('role:guru')->prefix('guru')->name('guru.')->group(function () {
        Route::get('kelola-kuis', [GuruModulController::class, 'index'])->name('modul.index');
        Route::get('kelola-kuis/{modul}', [GuruModulController::class, 'show'])->name('modul.show');
        Route::put('kelola-kuis/{modul}', [GuruModulController::class, 'update'])->name('modul.update');

        Route::get('riwayat-kuis', [GuruRiwayatController::class, 'index'])->name('riwayat.index');
        Route::put('riwayat-kuis/{idUser}/{idModul}', [GuruRiwayatController::class, 'update'])->name('riwayat.update');
    });

    Route::middleware('role:siswa')->prefix('siswa')->name('siswa.')->group(function () {
        Route::get('modul', [SiswaModulController::class, 'index'])->name('modul.index');
        Route::get('modul/{modul}', [SiswaModulController::class, 'show'])->name('modul.show');

        Route::get('modul/{modul}/kuis', [SiswaKuisController::class, 'create'])->name('kuis.create');
        Route::post('modul/{modul}/kuis', [SiswaKuisController::class, 'store'])->name('kuis.store');

        Route::get('riwayat', [SiswaRiwayatController::class, 'index'])->name('riwayat.index');
        Route::get('riwayat/{modul}', [SiswaRiwayatController::class, 'show'])->name('riwayat.show');
    });
});

require __DIR__.'/settings.php';
