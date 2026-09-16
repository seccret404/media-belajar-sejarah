<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        return request()->user()->isGuru()
            ? redirect()->route('guru.modul.index')
            : redirect()->route('siswa.modul.index');
    }
}
