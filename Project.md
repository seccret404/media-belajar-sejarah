- Media Belajar sejarah

# Role

Guru dan siswa

data user :
Nama
email
password
angkatan (khusus untuk siswa) untuk guru default tahun sekaran/now

Table yang dibutuhkan

- user
  -nama
  -email
  -angkatan
  -password
- history_user
  -id_user
  -id_modul
  -id_kuis
  -jawaban
  -skor

- modul
  -nama_modul

- kuis
  -id_modul
  -soal
  -jawaban_ekspektasi
  -key_jawaban

Fitur siswa:

- Membaca modul [akan ada 8 modul nanti nya exmp: A B C D E F G H]
- setiap modul akan memiliki 1 kuis, kuis akan bisa dilakukan apabila siswa sudah membuka modul dan mengklik tombol [ambil kuis] maka akan langsung redirect ke kuis
- tipe soal adalah essay
- soal berjumlah 5 yang dipilih acak untuk di kerjakan siswa
- untuk keamanan, ketika/selama siswa berada dihalamana kuis maka siswa tidak bisa belaih tab atau kembali ke app lain, akan auto tersubmit.
- apabila sudah dikerjakan siswa, maka tombol ambil kuis tidak lagi ada, melainkan review kuis -> sehingga yang muncul adalah soal, jawaban dan skor siswa
- siswa juga memiliki menu riwayat untuk melihat kuis dari modul yang sudah dikerjakan, hampir sama sebenarnya dengan point sebelumnya, dapat melihat nilai, soal, jawaban, dan review dari AI.
- untuk proses penilaian adalah menggunakan AI sebagai penetrasi -> jawaban siswa akan di kompare dengan ajawaban guru dan berdasarkan key yang mencangkup jawaban siswa terhadap jawaban guru.

Fitur guru:

- guru memiliki menu kelola kuis, ketika menu itu di klik maka akan menampilkan 8 modul
- ketika salah satu modul di klik maka itu akan mengarah ke pembuatan soal untuk modul itu sendiri, yang muncul adalah form yang bisa di tambah [+], dengan field soal, jawaban_ekspektasi/guru dan juga key.
  soal jumlahnya tidak terbatas. setelah sudah selesai membuat soalnya maka akan ada button summit kuis,
- kemudia akan ada menu untuk riwayat kuis, gimana ketika menu itu diklik akan menampilkan 8 modul , dan ketika salah satu module di klik maka akan nemampilkan table data nama, angkata , skor nya. akan aada btn detail untuk melihat soal dan jawaban siswa tersa skornya dalam bentuk modal scorll. diatas table akan ada search by nama boleh dan by tahun angkatan jgau boleh. jadi begitu kira" untuk gambaran sistemnya.

# Penilaian

- Penilaian akan menggunakana AI di backgroun dengan mengcompare jawaban siswa dengan jawaban guru berdasarkan kelengkapan key jawaban yang ada diset oleh guru.

# Teknologi

- Menggunakan laravel yang didalam laravelnya FE nya menggunakan react dalam satu project. Dataabse menggunakan mysql.

Langkah pengerjaan

- Buatkana project nya dulu
- Siapkan database
- create tampilan guru
