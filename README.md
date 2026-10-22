# REST API Sistem Review Kantin

Tugas 3 Praktikum Rekayasa Sistem Informasi: validasi (zod), format error seragam, autentikasi JWT, dan otorisasi berbasis role. Lanjutan dari Tugas 2.

## Teknologi
- Express.js 5
- SQL Server (driver `mssql`)
- zod (validasi), jsonwebtoken (JWT), bcryptjs (hash password)
- Swagger UI (`swagger-ui-express`, `yamljs`)

## Cara Menjalankan
1. Clone repository ini, lalu `npm install`
2. Pastikan database `rsi_kantin_db` sudah dibuat sesuai skema Tugas 2 (7 tabel)
3. Salin `.env.example` menjadi `.env`, lalu isi nilainya
4. Isi password akun uji: `node src/seed.js`
5. Jalankan server: `npm run dev` (atau `npm start`)
6. Buka dokumentasi: http://localhost:3000/docs

## Akun Uji
| Role | Email | Password |
|---|---|---|
| admin | admin@kantin.ac.id | Admin12345 |
| owner | budi.santoso@kantin.ac.id | Owner12345 |
| owner | siti.aminah@kantin.ac.id | Owner12345 |
| customer | rizky.pratama@student.ac.id | Customer12345 |

Pendaftaran lewat `POST /auth/register` selalu menghasilkan role `customer`.

## Endpoint dan Hak Akses
| Endpoint | Akses |
|---|---|
| `GET /stalls`, `GET /stalls/:id` | Publik |
| `POST /auth/register`, `POST /auth/login` | Publik |
| `GET /auth/me` | Login (semua role) |
| `POST /stalls/:id/reviews` | Login (semua role) |
| `POST /stalls` | owner, admin |
| `PUT /stalls/:id` | owner (hanya warung miliknya), admin |
| `DELETE /stalls/:id` | admin |

## Format Error
Semua error memakai satu format:

```json
{
  "status": "fail",
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "name minimal 3 karakter" }
  ]
}
```

- 400: validasi gagal
- 401: belum login / token tidak ada atau tidak valid
- 403: sudah login tetapi tidak punya akses
- 404: data tidak ditemukan
- 409: data duplikat