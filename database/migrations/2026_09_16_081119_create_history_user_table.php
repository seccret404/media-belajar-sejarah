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
            // jawaban/skor stay null from the moment a soal is assigned to a student
            // until they actually submit — that's what distinguishes an in-progress
            // attempt from a completed one.
            $table->text('jawaban')->nullable();
            $table->unsignedTinyInteger('skor')->nullable();
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
