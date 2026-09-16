<?php

namespace App\Models;

use Database\Factories\ModulFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_modul', 'urutan'])]
class Modul extends Model
{
    /** @use HasFactory<ModulFactory> */
    use HasFactory;

    protected $table = 'modul';

    /**
     * @return HasMany<Kuis, $this>
     */
    public function kuis(): HasMany
    {
        return $this->hasMany(Kuis::class, 'id_modul');
    }

    /**
     * @return HasMany<HistoryUser, $this>
     */
    public function historyUser(): HasMany
    {
        return $this->hasMany(HistoryUser::class, 'id_modul');
    }
}
