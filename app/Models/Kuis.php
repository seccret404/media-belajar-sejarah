<?php

namespace App\Models;

use Database\Factories\KuisFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id_modul', 'soal', 'jawaban_ekspektasi', 'key_jawaban'])]
class Kuis extends Model
{
    /** @use HasFactory<KuisFactory> */
    use HasFactory;

    protected $table = 'kuis';

    /**
     * @return BelongsTo<Modul, $this>
     */
    public function modul(): BelongsTo
    {
        return $this->belongsTo(Modul::class, 'id_modul');
    }

    /**
     * @return HasMany<HistoryUser, $this>
     */
    public function historyUser(): HasMany
    {
        return $this->hasMany(HistoryUser::class, 'id_kuis');
    }
}
