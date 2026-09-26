# Struktur Database — Media Belajar Sejarah

Dokumen ini mendaftar semua tabel yang ada di database (sesuai migration di
`database/migrations/`) beserta perannya masing-masing.

## 1. Tabel Inti Aplikasi

Empat tabel ini adalah jantung dari seluruh fitur belajar-mengajar di aplikasi.

### `users`

Akun guru dan siswa dalam satu tabel yang sama, dibedakan lewat kolom `role`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint | Primary key |
| `name` | string | Nama lengkap |
| `email` | string (unique) | Dipakai untuk login |
| `email_verified_at` | timestamp, nullable | Waktu verifikasi email |
| `password` | string | Hash password |
| `role` | enum(`guru`, `siswa`) | Menentukan akses menu & middleware `role:guru`/`role:siswa` |
| `angkatan` | smallint, nullable | Tahun masuk siswa; guru diisi tahun akun dibuat |
| `remember_token` | string, nullable | Untuk fitur "ingat saya" |

Registrasi mandiri lewat `/register` selalu mengunci `role = siswa` — akun guru
hanya bisa dibuat manual (tinker/seeder).

### `modul`

Daftar modul belajar sejarah. Hanya metadata — **materi bacaan** (tujuan
pembelajaran, isi per bagian) tidak disimpan di database, melainkan di file
statis `resources/data/modul-materi.json`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint | Primary key |
| `nama_modul` | string | Judul modul |
| `urutan` | tinyint (unique) | Urutan tampil & acuan `ModulContent::forUrutan()` untuk mengambil materi dari JSON |

### `kuis`

Bank soal esai per modul. Guru bisa menambah/mengedit/menghapus soal lewat
halaman Kelola Kuis (kalau soal itu belum pernah dikerjakan siswa manapun).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint | Primary key |
| `id_modul` | FK → `modul.id` (cascade delete) | Modul pemilik soal |
| `soal` | text | Pertanyaan esai |
| `jawaban_ekspektasi` | text | Jawaban referensi dari guru |
| `key_jawaban` | text | Poin-poin kunci yang diharapkan ada di jawaban siswa |

### `history_user`

Tabel paling penting di aplikasi ini — satu baris = satu soal yang ditugaskan
ke satu siswa. Menyimpan status pengerjaan, jawaban, skor, dan feedback AI
sekaligus.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint | Primary key |
| `id_user` | FK → `users.id` (cascade delete) | Siswa yang mengerjakan |
| `id_modul` | FK → `modul.id` (cascade delete) | Modul terkait |
| `id_kuis` | FK → `kuis.id` (cascade delete) | Soal spesifik yang ditugaskan |
| `jawaban` | text, nullable | Jawaban siswa. **NULL** = soal sudah diacak/ditugaskan tapi belum dikumpulkan |
| `skor` | tinyint unsigned, nullable, maks 20 | Skor per soal, diinput manual oleh guru. **NULL** = sudah dikumpulkan tapi belum dinilai guru ("Perlu Ditinjau"). Skor akhir satu modul = jumlah skor seluruh soalnya (5 soal × 20 = maks 100) |
| `review_ai` | text, nullable | Catatan/feedback dari AI (Ollama) — bahan pertimbangan guru, bukan penentu skor |

Constraint `unique(id_user, id_kuis)` — satu siswa tidak bisa punya dua baris
untuk soal yang sama, memastikan pengacakan soal hanya terjadi sekali per siswa
per modul.

## 2. Tabel Infrastruktur Laravel

Tabel bawaan framework, aktif dipakai sesuai driver yang diset di `.env`.

| Tabel | Driver terkait | Peran |
|---|---|---|
| `sessions` | `SESSION_DRIVER=database` | Menyimpan sesi login tiap user (dipakai, bukan file/cookie session) |
| `cache`, `cache_locks` | `CACHE_STORE=database` | Cache aplikasi disimpan di database |
| `jobs`, `job_batches`, `failed_jobs` | `QUEUE_CONNECTION=database` | Antrian background job (mis. pengiriman email verifikasi/reset password) |
| `password_reset_tokens` | — | Token untuk alur "lupa password" |

## 3. Tabel/Kolom Legacy (sudah tidak dipakai)

Sisa dari fitur menu Keamanan (2FA & passkey) yang sudah dihapus total dari
aplikasi. Tabel/kolomnya masih ada secara fisik di database (migration belum
di-rollback supaya tidak mengubah histori skema), tapi **tidak direferensikan
kode manapun lagi** dan selalu kosong/null untuk data baru:

- `passkeys` — tabel kredensial WebAuthn/passkey.
- `users.two_factor_secret`, `users.two_factor_recovery_codes`,
  `users.two_factor_confirmed_at` — kolom 2FA di tabel `users`.

Aman diabaikan; kalau suatu saat ingin benar-benar dibersihkan, perlu migration
baru untuk drop tabel/kolom ini.
