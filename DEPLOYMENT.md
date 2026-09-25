# Panduan Deployment

Dokumen ini menjelaskan cara mengakses VPS produksi, arsitektur deployment yang
dipakai, dan langkah-langkah untuk menerapkan perbaikan/update ke web yang sudah
live di `https://embedia.my.id`.

## 1. Ringkasan arsitektur

```
Browser ──HTTPS──▶ Caddy (port 80/443) ──HTTP──▶ Docker container "mbs" (port 8080)
                     │                                  │
                     │ (reverse proxy + TLS otomatis)   └─ php artisan serve (Laravel)
                     ▼
              Let's Encrypt (auto-renew)
```

- **VPS**: Rumahweb, Paket S (1 vCPU / 1GB RAM / 20GB SSD), Ubuntu 20.04.
- **IP**: `103.247.8.145`
- **Domain**: `embedia.my.id` (dan `www.embedia.my.id`), DNS dikelola di DomaiNesia,
  A record mengarah ke IP VPS di atas.
- **Reverse proxy + HTTPS**: Caddy, konfigurasi di `/etc/caddy/Caddyfile`.
  Caddy yang memegang port 80/443 publik dan otomatis mengurus sertifikat
  Let's Encrypt (auto-renew, tidak perlu campur tangan manual).
- **Aplikasi**: berjalan di dalam container Docker bernama **`mbs`**, image
  `media-belajar-sejarah:latest`, hanya bind ke `127.0.0.1:8080` (tidak
  diekspos langsung ke internet — semua traffic publik wajib lewat Caddy).
- **Database**: MySQL online di freesqldatabase.com (bukan database lokal di
  VPS), kredensial ada di `.env` di server.
- **Kode aplikasi**: di-clone di `/opt/media-belajar-sejarah` di VPS, dari
  repo GitHub `seccret404/media-belajar-sejarah` (branch `main`).

## 2. Akses ke VPS

```bash
ssh root@103.247.8.145
```

Catatan keamanan:
- Password root **tidak boleh** dikirim/disimpan di chat atau dokumen apa pun —
  hanya lewat SSH key yang sudah di-setup (`ssh-copy-id`).
- Jangan expose port 8080 ke publik. Kalau butuh cek langsung ke container,
  gunakan `curl http://127.0.0.1:8080` dari dalam VPS saja.

## 3. Struktur file penting di VPS

| Path | Isi |
|---|---|
| `/opt/media-belajar-sejarah` | Clone repo (working tree, termasuk `.git`) |
| `/opt/media-belajar-sejarah/.env` | Environment production (APP_URL, DB, OLLAMA, MAIL, dll) — **hanya ada di server, tidak pernah di-commit** |
| `/etc/caddy/Caddyfile` | Konfigurasi reverse proxy + HTTPS |
| `/etc/fstab` | Ada entry swap (`/swapfile`, `/swapfile2`) untuk bantu RAM 1GB saat build |

## 4. Langkah-langkah deploy perbaikan/update

Alur standar setiap kali ada perubahan kode yang perlu naik ke production:

### 4.1. Di komputer lokal

1. Kerjakan perubahan seperti biasa di local (`/Users/edward/Project/media-belajar-sejarah`).
2. Pastikan test/lint lulus (`php artisan test`, `vendor/bin/pint`, `vendor/bin/phpstan analyse` bila relevan).
3. Commit dan push ke `origin main`:
   ```bash
   git add <file-yang-berubah>
   git commit -m "pesan commit"
   git push origin main
   ```

### 4.2. Di VPS — tarik kode terbaru & rebuild image

```bash
ssh root@103.247.8.145

cd /opt/media-belajar-sejarah
git pull origin main
docker build -t media-belajar-sejarah:latest .
```

Proses build butuh sekitar 1-2 menit (composer install + npm build). RAM VPS
hanya 1GB, jadi kalau build terasa berat, pastikan swap masih aktif
(`free -h` harus menunjukkan swap ~2GB tersedia).

### 4.3. Ganti container yang jalan dengan image baru

```bash
docker stop mbs
docker rm mbs
docker run -d \
  --name mbs \
  --env-file /opt/media-belajar-sejarah/.env \
  -p 127.0.0.1:8080:8080 \
  --restart unless-stopped \
  media-belajar-sejarah:latest
```

Container ini otomatis menjalankan `php artisan migrate --force` sebelum
start server (lihat `CMD` di `Dockerfile`), jadi migration baru akan
otomatis diterapkan ke database online setiap kali di-restart dengan image
baru.

> Nama container **wajib** `mbs` — kalau salah ketik nama lain saat `docker run`,
> container lama yang masih bind ke port 8080 tidak akan tergantikan dan akan
> muncul error "port is already allocated". Selalu cek dulu dengan `docker ps -a`
> kalau ragu container mana yang sedang aktif.

### 4.4. Verifikasi

```bash
# dari dalam VPS
curl -sI http://127.0.0.1:8080 | head -1        # harus HTTP/1.1 200 OK
docker logs mbs --tail 30                        # pastikan "Server running on ..." muncul, tanpa error

# dari luar (lokal / mana saja)
curl -sI https://embedia.my.id/ | head -1        # harus HTTP/2 200
curl -s https://embedia.my.id/ | grep -o 'https://embedia.my.id/build/assets/[^"]*' | head -3
# pastikan semua asset URL pakai https://, bukan http://
```

Kalau bisa, buka `https://embedia.my.id` di browser (hard refresh /
incognito) untuk memastikan tampilan benar-benar muncul, bukan cuma cek
lewat `curl` (curl tidak menjalankan JavaScript, jadi bisa "terlihat sukses"
padahal ada error di sisi client seperti mixed-content).

### 4.5. Caddy (biasanya tidak perlu disentuh)

Caddy hanya perlu diubah kalau ada perubahan domain/subdomain atau routing.
Kalau `Caddyfile` diedit:

```bash
sudo systemctl reload caddy     # apply config tanpa downtime
systemctl status caddy          # pastikan "active (running)"
```

## 5. Rollback cepat

Kalau deploy baru ternyata bermasalah, paling cepat adalah checkout commit
sebelumnya lalu ulangi langkah 4.2–4.4:

```bash
cd /opt/media-belajar-sejarah
git log --oneline -5        # cari commit hash sebelum perubahan bermasalah
git checkout <commit-hash-lama>
docker build -t media-belajar-sejarah:latest .
docker stop mbs && docker rm mbs
docker run -d --name mbs --env-file .env -p 127.0.0.1:8080:8080 --restart unless-stopped media-belajar-sejarah:latest
```

Setelah masalah di kode lokal diperbaiki, jangan lupa `git checkout main` lagi
di VPS supaya kembali mengikuti branch utama untuk deploy berikutnya.

## 6. Hal-hal yang pernah jadi masalah (jangan diulangi)

- **Mixed content / halaman blank**: pastikan `bootstrap/app.php` selalu
  punya `$middleware->trustProxies(at: '*')` — tanpa ini, Laravel tidak tahu
  request aslinya HTTPS (karena Caddy meneruskan sebagai HTTP biasa ke
  container), sehingga semua asset (CSS/JS/font) di-generate dengan skema
  `http://` dan diblokir browser di halaman `https://`.
- **Container name salah**: selalu pastikan nama container yang di-stop/rm
  adalah `mbs` (cek dulu dengan `docker ps -a` bila ragu), bukan nama lain
  yang ditebak.
- **Mirror APT Rumahweb bisa 404**: kalau butuh `apt install` sesuatu di VPS
  dan gagal, cek `/etc/apt/sources.list` — sempat harus ganti mirror
  `cermin.rumahweb.id` ke `archive.ubuntu.com`.
