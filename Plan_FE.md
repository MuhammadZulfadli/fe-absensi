# Plan_FE — Frontend Vue.js

Tech stack: **Vue.js (Vite)** · **Vue Router** · **Axios**

---

## Arsitektur Frontend

```
┌─────────────────────────────────────────────────────────┐
│                    Vue.js SPA                           │
│                                                         │
│   ┌──────────────┐           ┌───────────────────────┐  │
│   │  Auth Guard  │           │      Vue Router       │  │
│   │  Cek JWT     │           │  /login               │  │
│   │  Cek role    │           │  /mahasiswa/*         │  │
│   └──────────────┘           │  /dosen/*             │  │
│                              └───────────────────────┘  │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │                   Pages / Views                  │  │
│   │                                                  │  │
│   │  Login         Scan Barcode    Dashboard Dosen   │  │
│   │  Riwayat Mhs   Kelola MK       Sesi & QR Code    │  │
│   │                                Laporan Absensi   │  │
│   └──────────────────────────────────────────────────┘  │
│                          │                              │
│                   Axios (REST API)                      │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
                   Backend Express.js
```

---

## Peta Halaman

```
/login
  └── Form login (email + password)

/mahasiswa
  ├── /scan         ← Kamera scan QR code → kirim ke backend
  └── /riwayat      ← Tabel riwayat absensi milik sendiri

/dosen
  ├── /dashboard    ← Ringkasan sesi aktif & statistik
  ├── /mata-kuliah  ← CRUD mata kuliah
  ├── /sesi/:id     ← Tampilkan QR code + daftar hadir live
  └── /laporan      ← Rekap absensi per MK, export CSV
```

---

## Alur Navigasi Berdasarkan Role

```
User buka app
      │
      ▼
  Ada JWT?
  ├── Tidak → /login
  └── Ya →
        ├── role = mahasiswa → /mahasiswa/scan
        └── role = dosen     → /dosen/dashboard
```

---

## FE-01 · Setup Project

Inisialisasi project Vue.js dan konfigurasi dasar.

- Init project dengan Vite + Vue
- Install dependency: Vue Router, Axios
- Setup struktur folder: `views/`, `components/`, `router/`, `services/`
- Konfigurasi Axios base URL dari environment variable
- Tambahkan `.env.example` dan `README.md`

---

## FE-02 · Auth — Halaman Login & Route Guard

Implementasi login dan proteksi halaman berdasarkan role.

- Buat halaman `/login` dengan form email dan password
- Setelah login berhasil, simpan JWT ke `localStorage`
- Buat route guard di Vue Router: redirect ke login jika tidak ada token
- Redirect otomatis ke halaman yang sesuai berdasarkan role setelah login
- Tambahkan fungsi logout (hapus token, redirect ke `/login`)
- Gunakan Tailwincss sebagai framework stylingnya

---

## FE-03 · Halaman Scan Barcode (Mahasiswa)

Mahasiswa scan QR code untuk absensi.

- Buat halaman `/mahasiswa/scan`
- Integrasikan kamera menggunakan library `vue-qrcode-reader`
- Setelah QR terbaca, kirim token ke `POST /absensi` via Axios
- Tampilkan feedback hasil: notifikasi sukses atau pesan error yang jelas
- Tangani kasus: kamera tidak tersedia, QR tidak terbaca

---

## FE-04 · Halaman Riwayat Absensi (Mahasiswa)

Mahasiswa bisa melihat riwayat kehadirannya.

- Buat halaman `/mahasiswa/riwayat`
- Fetch data dari `GET /absensi/saya`
- Tampilkan dalam tabel: mata kuliah, tanggal sesi, status hadir
- Tambahkan state loading dan empty state jika belum ada data

---

## FE-05 · Dashboard Dosen

Halaman utama dosen setelah login.

- Buat halaman `/dosen/dashboard`
- Tampilkan ringkasan: jumlah mata kuliah, sesi aktif hari ini
- Tambahkan tombol shortcut menuju buka sesi baru dan laporan

---

## FE-06 · Manajemen Mata Kuliah (Dosen)

Dosen mengelola mata kuliah yang diampu.

- Buat halaman `/dosen/mata-kuliah`
- Tampilkan daftar mata kuliah dalam tabel
- Sediakan form tambah dan edit mata kuliah (modal atau halaman terpisah)
- Tambahkan aksi hapus dengan konfirmasi
- Semua operasi terhubung ke endpoint CRUD mata kuliah di backend

> **[ISSUE]** Tampilkan penanda status sesi di setiap baris mata kuliah berdasarkan
> field `sesi_status` dari response backend:
> - `aktif` → badge hijau *"Sesi Berlangsung"*
> - `selesai` → badge abu-abu *"Sesi Selesai"* disertai waktu sesi terakhir
> - `belum_ada_sesi` → tidak perlu badge
>
> Tombol *"Buka Sesi"* hanya ditampilkan jika status bukan `aktif`.

---

## FE-07 · Sesi Kelas & Tampilan QR Code (Dosen)

Dosen membuka sesi dan menampilkan QR code untuk mahas iswa.

- Dari halaman mata kuliah, dosen bisa membuka sesi baru
- Setelah sesi dibuat, navigasi ke halaman `/dosen/sesi/:id`
- Tampilkan QR code dari `barcode_token` menggunakan library `qrcode` atau `vue-qrcode`
- Tampilkan countdown timer hingga barcode expired
- Tampilkan daftar mahasiswa yang sudah absen secara live (polling atau refresh berkala)
- Tombol tutup sesi manual

> **[BUG FIX]** Ketika dosen mencoba membuka sesi baru pada mata kuliah yang sesinya
> masih aktif, backend akan return `409 Conflict`. Frontend wajib menangkap error ini
> dan menampilkan pesan yang jelas, misalnya: *"Sesi untuk mata kuliah ini masih
> berjalan. Tutup sesi sebelumnya terlebih dahulu."* Tombol buka sesi sebaiknya
> dinonaktifkan (disabled) jika terdeteksi sudah ada sesi aktif untuk mata kuliah tersebut.

---

## FE-08 · Laporan Absensi (Dosen)

Dosen melihat rekap kehadiran dan bisa export data.

- Buat halaman `/dosen/laporan`
- Pilih mata kuliah → tampilkan rekap kehadiran seluruh sesi
- Tampilkan data dalam tabel: nama mahasiswa, NIM, jumlah hadir, persentase
- Tambahkan fitur export ke CSV (bisa dilakukan di sisi frontend dari data yang sudah di-fetch)

---

## FE-09 · Testing & Deployment

Pastikan semua halaman berjalan sebelum deploy.

- Test manual seluruh alur: login → scan → riwayat (mahasiswa) dan login → buka sesi → rekap (dosen)
- Pastikan route guard bekerja: mahasiswa tidak bisa akses halaman dosen, dan sebaliknya
- Pastikan feedback error dari backend ditampilkan dengan baik di UI
- Deploy ke static hosting (Vercel atau Netlify) dan arahkan base URL Axios ke backend production
