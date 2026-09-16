<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('history_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->cascadeOnDelete();
            $table->foreignId('id_modul')->constrained('modul')->cascadeOnDelete();
            $table->foreignId('id_kuis')->constrained('kuis')->cascadeOnDelete();
            $table->text('jawaban');
            $table->unsignedTinyInteger('skor');
            $table->text('review_ai')->nullable();
            $table->timestamps();

            $table->unique(['id_user', 'id_kuis']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('history_user');
    }
};
