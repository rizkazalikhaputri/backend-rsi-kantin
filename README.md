# Sistem Review Kantin

Aplikasi review warung kantin. Repository ini berisi **backend** (REST API Express.js + SQL Server) dan **frontend** (React TypeScript) yang saling terintegrasi.

- Tugas 2: REST API CRUD dan integrasi database
- Tugas 3: validasi (zod), autentikasi JWT, otorisasi berbasis role
- Tugas 4: frontend React yang terhubung ke backend

## Teknologi

| Bagian | Teknologi |
|---|---|
| Backend | Node.js, Express.js 5, mssql (SQL Server), JWT, bcryptjs, zod, Swagger UI |
| Frontend | React, TypeScript, Vite, React Router |
| Komunikasi HTTP | **Axios** (dengan interceptor untuk token JWT dan penanganan 401) |
| Database | Microsoft SQL Server (`rsi_kantin_db`) |

## Struktur Proyek

```
backend-rsi-kantin/
├── src/                  # Backend (config, controllers, middlewares, routes, validations)
├── frontend/             # Frontend React TypeScript
│   └── src/
│       ├── api/          # Axios instance, authApi, stallApi
│       ├── components/   # Navbar, ProtectedRoute, Loading, EmptyState, ErrorMessage
│       ├── context/      # AuthContext (status login dan role)
│       ├── pages/        # Daftar, detail, form warung, login, register
│       ├── types/        # Tipe data TypeScript
│       └── utils/        # Aturan hak akses per role
├── openapi.yaml          # Dokumentasi API
├── .env.example          # Contoh konfigurasi backend
└── README.md
```

## Prasyarat

- Node.js 18 atau lebih baru
- Microsoft SQL Server yang sedang berjalan, dengan database `rsi_kantin_db` beserta tabel dari Tugas 2

## Konfigurasi Environment

### Backend

Salin `.env.example` menjadi `.env` di folder root, lalu isi:

```
PORT=3000
DB_USER=
DB_PASSWORD=
DB_SERVER=localhost
DB_NAME=rsi_kantin_db
JWT_SECRET=
```

### Frontend

Salin `frontend/.env.example` menjadi `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:3000
```

> File `.env` tidak diunggah ke repository. Jangan memasukkan password database atau JWT secret ke repository publik.

## Cara Menjalankan

Jalankan backend dan frontend di dua terminal terpisah.

**Backend** (http://localhost:3000)

```bash
npm install
npm run dev
```

**Frontend** (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

Dokumentasi Swagger backend: http://localhost:3000/docs

## Akun untuk Pengujian

Registrasi lewat aplikasi selalu membuat akun dengan role `customer`. Role `owner` dan `admin` diatur langsung di database, contoh:

```sql
UPDATE users SET role = 'owner' WHERE email = 'email-anda@contoh.com';
UPDATE users SET role = 'admin' WHERE email = 'email-anda@contoh.com';
```

Setelah mengubah role, login ulang agar token baru memuat role terbaru.

## Endpoint yang Dipakai Frontend

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/stalls` | Publik (mendukung `search`, `category`, `page`, `limit`) |
| GET | `/stalls/:id` | Publik |
| POST | `/stalls` | Owner, Admin |
| PUT | `/stalls/:id` | Admin, atau Owner hanya untuk warung miliknya |
| DELETE | `/stalls/:id` | Admin |
| POST | `/auth/register` | Publik |
| POST | `/auth/login` | Publik |
| GET | `/auth/me` | Pengguna yang sudah login |

## Hak Akses per Role (Tampilan Frontend)

| Role | Yang bisa dilakukan |
|---|---|
| Publik (belum login) | Melihat daftar dan detail warung, registrasi, login |
| Customer | Sama dengan publik, tanpa akses pengelolaan warung |
| Owner | Menambah warung, mengubah warung miliknya sendiri |
| Admin | Menambah, mengubah, dan menghapus semua warung |

Tombol pengelolaan disembunyikan di tampilan sesuai role, tetapi **backend tetap menjadi penentu akhir** hak akses.

## Penanganan Autentikasi dan Error

- Token JWT disimpan di `localStorage` dan dipasang otomatis ke header `Authorization: Bearer <token>` oleh interceptor Axios.
- Saat aplikasi dibuka, frontend memanggil `GET /auth/me` untuk memvalidasi token dan memuat data pengguna.
- **401**: token dihapus dan pengguna diarahkan ke halaman login dengan pesan sesi berakhir.
- **403**: pesan dari backend ditampilkan (misalnya "Anda bukan pemilik warung ini"); halaman terlarang menampilkan pesan akses ditolak.
- Error validasi backend ditampilkan per field; error jaringan menampilkan pesan "Tidak dapat terhubung ke server".
- Tersedia loading state, empty state, dan error state di halaman daftar warung.

## Logout

JWT bersifat stateless, sehingga logout dilakukan dengan menghapus token di sisi client.
