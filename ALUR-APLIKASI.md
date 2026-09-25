# Alur Aplikasi — Media Belajar Sejarah

Dokumen ini menjelaskan alur (flow) aplikasi Media Belajar Sejarah sesuai kondisi kode saat ini: Laravel 13 + Inertia.js + React (TypeScript), dua peran pengguna (**guru** dan **siswa**), dengan penilaian esai otomatis berbasis AI.

## 1. Ringkasan Peran

| Peran     | Bisa akses                              | Tidak bisa akses                                      |
| --------- | --------------------------------------- | ----------------------------------------------------- |
| **guru**  | Kelola Kuis, Riwayat Kuis (semua siswa) | Halaman siswa (modul, kerjakan kuis, riwayat pribadi) |
| **siswa** | Modul, Kerjakan Kuis, Riwayat pribadi   | Halaman guru (kelola kuis, riwayat semua siswa)       |

Role disimpan di kolom `users.role` (`'guru' | 'siswa'`) dan dipaksakan lewat middleware `role:guru` / `role:siswa` (`app/Http/Middleware/EnsureUserHasRole.php`) yang membungkus grup route `guru/*` dan `siswa/*` di `routes/web.php`.

- **Registrasi mandiri selalu jadi siswa** — `CreateNewUser` action mengunci `role => 'siswa'` untuk siapa pun yang daftar lewat `/register`. Akun guru harus dibuat manual (tinker/seeder), tidak ada form pendaftaran guru.

## 2. Alur Autentikasi

Dibangun di atas Laravel Fortify. Semua teks UI sudah dalam Bahasa Indonesia.

```
/  (welcome)
 ├─ Masuk ───────► /login
 │                   ├─ email + password + "ingat saya"
 │                   └─ lupa password? ──► /forgot-password ─(email berisi link)─► /reset-password/{token} ──► login ulang
 └─ Daftar sebagai siswa ─► /register
                     ├─ nama, email, angkatan (tahun masuk), password
                     └─ auto-login sebagai siswa setelah submit
```

Setelah login sukses → redirect ke `/dashboard` → `DashboardController` mengalihkan berdasarkan role:

- `role = guru` → `route('guru.modul.index')` (Kelola Kuis)
- `role = siswa` → `route('siswa.modul.index')` (Modul Belajar)

Menu **Pengaturan** (ikon avatar di sidebar) tersedia untuk kedua role: Profil (nama, email), Tampilan (light/dark, default light). Tidak ada menu ganti password/2FA/passkey maupun hapus akun sendiri — reset password hanya lewat alur "lupa password" di atas.

## 3. Alur Guru

```
Kelola Kuis (index)                Kelola Kuis (per modul)              Riwayat Kuis
────────────────────               ─────────────────────────            ──────────────────────
/guru/kelola-kuis                  /guru/kelola-kuis/{modul}             /guru/riwayat-kuis
Daftar 8 modul + jumlah soal   ──►  Form daftar soal esai:                Tabel semua siswa yang
per modul (card grid)               • edit soal / jawaban guru /          sudah submit kuis:
                                       key jawaban                        • cari nama / angkatan
                                     • tambah soal baru                   • badge status: "Perlu
                                     • hapus soal (hanya kalau              Ditinjau" (amber, belum
                                       belum pernah dikerjakan               ada skor) atau skor
                                       siswa manapun)                       final (badge warna:
                                     • simpan (PUT, replace soal            hijau ≥80, kuning ≥60,
                                       yang dihapus dari form)              merah <60)
                                                                          • baris "Perlu Ditinjau"
                                                                            selalu tampil di atas
                                                                          • tombol Detail ─► dialog
                                                                            tiap soal: jawaban +
                                                                            feedback AI + input
                                                                            skor manual (selalu
                                                                            bisa diisi/diubah,
                                                                            prefilled kalau sudah
                                                                            pernah dinilai)
                                                                          • "Simpan Skor" (PUT) —
                                                                            guru bebas menambah
                                                                            atau merevisi skor
                                                                            kapan pun
```

Catatan penting:

- Data **materi bacaan modul** (judul, tujuan pembelajaran, isi per bagian) **tidak** dikelola dari UI guru — itu berasal dari file statis `resources/data/modul-materi.json` yang dibaca lewat `App\Services\ModulContent`. Guru hanya mengelola **soal kuis** (tabel `kuis`), bukan materinya.
- Riwayat Kuis hanya menampilkan siswa yang **sudah submit** (`jawaban IS NOT NULL`) — pengerjaan yang masih "in-progress" (soal sudah diacak tapi belum dikumpulkan) tidak muncul di sini maupun di daftar modul selesai.
- **AI tidak menentukan skor final** — AI hanya memberi feedback teks (`review_ai`) sebagai bahan pertimbangan. Guru yang membaca feedback itu dan menginput skor (0-100) secara manual per soal. Lihat §4.3 untuk detail alurnya.

## 4. Alur Siswa

### 4.1 Baca Modul (slide deck)

```
/siswa/modul                    /siswa/modul/{modul}
─────────────────                ──────────────────────────────────────────
Daftar 8 modul + status:         Slide 1 (intro): Tujuan Pembelajaran +
• "Sudah dikerjakan"               Pertanyaan Pemantik
  (ikon hijau)                   Slide 2..N: satu slide per bagian materi,
• "Belum dikerjakan"               konten di-parse jadi blok visual:
  (ikon abu-abu)                   • paragraf biasa
                                    • daftar poin (bullet list + judul)
                                    • kotak "Ingat" / "Tahukah Kamu" /
                                      "Contoh" (berwarna, ada ikon)
                                    • timeline vertikal (untuk materi
                                      berbentuk tahun → peristiwa)
                                  Progress bar + navigasi Sebelumnya/
                                  Selanjutnya di tiap slide.
                                  Slide terakhir: tombol "Ambil Kuis"
                                  (hanya muncul kalau belum pernah
                                  mengerjakan kuis modul ini)
```

### 4.2 Ambil & Kerjakan Kuis

```
Klik "Ambil Kuis"
      │
      ▼
Dialog konfirmasi ("aksi tidak bisa dibatalkan, jangan pindah tab")
      │  Batal ──► kembali ke slide
      │  Ya, Mulai Kuis
      ▼
GET /siswa/modul/{modul}/kuis
      │
      ├─ Kalau BELUM pernah ambil kuis modul ini:
      │     → pilih 5 soal ACAK dari bank soal modul tsb
      │     → simpan langsung ke tabel history_user (jawaban masih NULL)
      │     → acakan ini PERMANEN untuk siswa tsb (tidak diacak ulang)
      │
      ├─ Kalau SUDAH pernah ambil tapi BELUM submit:
      │     → tampilkan lagi 5 soal yang SAMA (dari history_user)
      │
      └─ Kalau SUDAH submit sebelumnya:
            → redirect ke halaman modul (tampil sebagai review, bukan form)

Halaman Kerjakan Kuis:
  • badge "X / 5 terjawab" + progress bar
  • peringatan anti-curang: pindah tab / minimize akan AUTO-SUBMIT
    (listener `visibilitychange` di browser)
  • textarea per soal
  • tombol "Kumpulkan Kuis" (submit manual)
```

### 4.3 Submit, Feedback AI, dan Penilaian Guru

AI **tidak** menentukan skor akhir. Alurnya dipecah jadi dua tahap terpisah:
siswa submit → AI kasih feedback (langsung terlihat siswa) → **guru** yang
baca feedback itu dan input skor manual → skor final baru muncul ke siswa.

```
Tahap 1 — Submit siswa
───────────────────────
POST /siswa/modul/{modul}/kuis  (jawaban[] per id soal)
      │
      ├─ Tolak (409) kalau kuis belum diambil, atau sudah pernah disubmit
      │
      ├─ Untuk tiap dari 5 soal:
      │     GradingService::grade($soal, $jawabanSiswa)
      │        │
      │        ├─ Kalau OLLAMA_API_KEY dikonfigurasi:
      │        │     → OllamaGradingService: kirim soal + jawaban guru +
      │        │       key_jawaban + jawaban siswa ke model AI (Ollama Cloud)
      │        │     → AI balas teks polos berisi catatan feedback saja
      │        │       (prompt eksplisit melarang AI menyebutkan angka
      │        │       skor sama sekali — lihat §7)
      │        │     → kalau gagal/response kosong → fallback pesan
      │        │       "penilaian otomatis gagal diproses"
      │        │
      │        └─ Kalau API key kosong:
      │              → PendingGradingService: "penilaian AI belum
      │                diaktifkan" (placeholder, dipakai saat testing)
      │
      ├─ Simpan jawaban + review_ai ke history_user — skor TETAP NULL
      │   (1 transaksi DB singkat, terpisah dari pemanggilan AI yang
      │   bisa lambat)
      │
      └─ Redirect ke /siswa/modul/{modul} → bagian "Review Kuis":
          tiap soal + jawaban siswa + feedback AI + badge "Perlu
          Ditinjau" (skor belum ada)

Tahap 2 — Penilaian guru
─────────────────────────
Guru buka /guru/riwayat-kuis, klik baris manapun (baik yang berstatus
"Perlu Ditinjau" maupun yang sudah punya skor) ─► dialog per soal:
baca jawaban + feedback AI, input/ubah skor (0-100) ─►
PUT /guru/riwayat-kuis/{idUser}/{idModul} {skor: {id_kuis: nilai}}
      │
      ├─ Guru bebas menambah skor baru ATAU mengubah skor yang sudah
      │   final kapan pun — endpoint ini tidak membedakan keduanya
      │
      └─ Setelah tersimpan, siswa langsung melihat skor (baru atau
          revisi) tersebut di halaman modul & riwayatnya (badge warna
          berdasarkan skor)
```

### 4.4 Riwayat

```
/siswa/riwayat                       /siswa/riwayat/{modul}
──────────────────────                ──────────────────────────
Daftar modul yang sudah                Detail per soal: pertanyaan,
dikerjakan + status:                   jawaban siswa, skor (atau badge
• skor rata-rata (badge warna)           "Perlu Ditinjau"), review AI
  kalau semua soal sudah dinilai         (read-only, sama seperti bagian
• "Perlu Ditinjau" kalau masih ada       review di halaman modul)
  soal yang belum diberi skor guru
Kalau belum ada yang dikerjakan:
tampil empty state (ikon + pesan)
```

## 5. Struktur Data Kunci

| Tabel/Sumber   | Isi                                                                                               | Catatan                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `modul`        | `id`, `nama_modul`, `urutan`                                                                      | Hanya metadata; **materi bacaan** ada di `resources/data/modul-materi.json` (di-load via `ModulContent`, di-cache)                                                 |
| `kuis`         | `id_modul`, `soal`, `jawaban_ekspektasi`, `key_jawaban`                                           | Bank soal esai per modul; diisi awal dari `resources/data/kuis-evaluasi.json`, bisa diedit guru                                                                    |
| `history_user` | `id_user`, `id_modul`, `id_kuis`, `jawaban` (nullable), `skor` (nullable), `review_ai` (nullable) | Satu baris = satu soal yang ditugaskan ke satu siswa. `jawaban IS NULL` = soal sudah diacak/ditugaskan tapi **belum dikumpulkan**. `skor IS NULL` (padahal `jawaban` sudah terisi) = sudah dikumpulkan tapi **belum dinilai guru**. Unique per `(id_user, id_kuis)` |

Alasan `jawaban`/`skor` nullable: keduanya independen dan masing-masing menandai satu transisi status —
`jawaban` memisahkan "kuis sudah diacak untuk siswa ini" dari "kuis sudah dikumpulkan", sementara `skor`
memisahkan "sudah dikumpulkan" dari "sudah dinilai guru". `review_ai` diisi otomatis begitu siswa submit
(independen dari `skor`), sedangkan `skor` hanya diisi lewat input manual guru di Riwayat Kuis.

## 6. Ringkasan Route

| Method           | Path                        | Nama Route                               | Halaman                      |
| ---------------- | --------------------------- | ---------------------------------------- | ---------------------------- |
| GET              | `/`                         | `home`                                   | Welcome                      |
| GET/POST         | `/login`                    | `login` / `login.store`                  | Login                        |
| GET/POST         | `/register`                 | `register` / `register.store`            | Register (selalu jadi siswa) |
| GET/POST         | `/forgot-password`          | `password.request` / `password.email`    | Lupa password                |
| GET/POST         | `/reset-password/{token}`   | `password.reset` / `password.update`     | Reset password               |
| GET              | `/dashboard`                | `dashboard`                              | Redirect sesuai role         |
| GET              | `/guru/kelola-kuis`         | `guru.modul.index`                       | Daftar modul (guru)          |
| GET/PUT          | `/guru/kelola-kuis/{modul}` | `guru.modul.show` / `guru.modul.update`  | Kelola soal per modul        |
| GET              | `/guru/riwayat-kuis`        | `guru.riwayat.index`                     | Riwayat semua siswa          |
| PUT              | `/guru/riwayat-kuis/{idUser}/{idModul}` | `guru.riwayat.update`        | Input skor manual per soal   |
| GET              | `/siswa/modul`              | `siswa.modul.index`                      | Daftar modul (siswa)         |
| GET              | `/siswa/modul/{modul}`      | `siswa.modul.show`                       | Slide materi + review kuis   |
| GET/POST         | `/siswa/modul/{modul}/kuis` | `siswa.kuis.create` / `siswa.kuis.store` | Ambil & submit kuis          |
| GET              | `/siswa/riwayat`            | `siswa.riwayat.index`                    | Riwayat pribadi              |
| GET              | `/siswa/riwayat/{modul}`    | `siswa.riwayat.show`                     | Detail riwayat per modul     |
| GET/PATCH        | `/settings/profile`         | `profile.edit` / `.update`               | Pengaturan profil            |
| GET              | `/settings/appearance`      | `appearance.edit`                        | Tema tampilan                |

## 7. Konfigurasi Penilaian AI

- Provider: **Ollama Cloud** (`https://ollama.com/api/chat`), diatur lewat `OLLAMA_URL`, `OLLAMA_API_KEY`, `OLLAMA_MODEL` di `.env`.
- Kalau `OLLAMA_API_KEY` kosong → otomatis pakai `PendingGradingService` (feedback placeholder "penilaian AI belum diaktifkan") — ini juga yang dipakai saat menjalankan test suite, supaya test tetap cepat dan tidak bergantung koneksi internet.
- Model aktif saat ini: `gpt-oss:20b`.
- **AI sama sekali tidak menyentuh kolom `skor`** — lihat §4.3. Prompt sistemnya (`OllamaGradingService::systemPrompt()`) secara eksplisit menginstruksikan AI untuk hanya menulis catatan feedback teks polos (bukan JSON, bukan angka skor); hasilnya langsung disimpan ke `review_ai`.
