# Layanan CRUD Biodata

API sederhana untuk mengelola data biodata menggunakan Express dan PostgreSQL.

## Persyaratan

- Node.js
- PostgreSQL

## Menjalankan aplikasi

1. Pasang dependensi dengan `npm install`.
2. Buat tabel biodata dengan menjalankan `database.sql` pada database yang digunakan.
3. Salin `.env.example` menjadi `.env`, lalu sesuaikan konfigurasi PostgreSQL.
4. Atur variabel lingkungan dari `.env` pada shell, kemudian jalankan `npm start`.

Variabel `.env` tidak dibaca otomatis oleh aplikasi. Atur nilainya pada lingkungan proses sebelum menjalankan aplikasi.
