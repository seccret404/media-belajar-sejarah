<?php

namespace App\Models;

use Database\Factories\HistoryUserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_user', 'id_modul', 'id_kuis', 'jawaban', 'skor', 'review_ai'])]
class HistoryUser extends Model
{
    /** @use HasFactory<HistoryUserFactory> */
    use HasFactory;

    protected $table = 'history_user';

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * @return BelongsTo<Modul, $this>
     */
    public function modul(): BelongsTo
    {
        return $this->belongsTo(Modul::class, 'id_modul');
    }

    /**
     * @return BelongsTo<Kuis, $this>
     */
    public function kuis(): BelongsTo
    {
        return $this->belongsTo(Kuis::class, 'id_kuis');
    }
}
