# 🌸 Rosezzty Pre-Order E-Commerce - Backend (Express.js + MySQL)
Backend untuk aplikasi Pre-Order E-Commerce Rosezzty yang berfokus pada produk K-Pop (terutama NCT 127) dengan sistem pre-order (DP).
API ini melayani dua peran utama: Pelanggan dan Admin.

## ✨ Fitur Utama
- Autentikasi pengguna (pelanggan & admin) + otorisasi berbasis role.
- Manajemen produk: CRUD produk, kategori, stok (admin).
- Pemesanan pre-order: buat pesanan, DP, status pesanan, riwayat.
- Pembayaran (record & verifikasi manual/otomatis sesuai implementasi).
- Testimoni pelanggan (moderasi admin).
- Pelacakan status pesanan (pelanggan).
- CORS terkonfigurasi untuk frontend Rosezzty.

## 🛠️ Arsitektur Singkat
- Framework: Express.js
- DB: MySQL
- ORM/Query: (sesuaikan) — contoh di bawah menggunakan query builder dasar
- Auth: JWT (Bearer Token)
- Validasi: Middleware (Joi/Yup/express-validator sesuai proyekmu)
- Logger: morgan/winston (opsional)
- CORS: whitelist domain frontend
- Tools: Visual Studio Code, GitHub, Figma, Draw.io, POSTMAN

## Struktur Folder (contoh)
```
rosezetty-backend/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/        # db, env, cors
│  ├─ middleware/    # auth, errorHandler, validator
│  ├─ modules/
│  │   ├─ auth/      # routes, controller, service
│  │   ├─ users/
│  │   ├─ products/
│  │   ├─ orders/
│  │   ├─ payments/
│  │   └─ testimonials/
│  └─ utils/         # helpers (jwt, response, etc.)
├─ .env.example
├─ package.json
└─ README.md
```

### Install dependencies
```
npm install
```

### Setup database (buat DB kosong)
```
mysql -u root -p -e "CREATE DATABASE rosezzty_db DEFAULT CHARACTER SET utf8mb4"
```

### (Opsional) Jalankan seed/migrasi sesuai proyekmu
```
npm run migrate && npm run seed
```

### Jalankan project
```
npm run dev
npm run build
```

## Autentikasi (JWT)
- Login → terima accessToken (Bearer)
- Sertakan header: Authorization: Bearer <token>

## 🧩 Contoh Endpoint Utama
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me           # requires auth
- GET    /api/products        # user
- GET    /api/products/:id    # user
- POST   /api/products        # admin
- PUT    /api/products/:id    # admin
- DELETE /api/products/:id    # admin
- POST   /api/testimonials                # buat testimoni (customer)
- GET    /api/testimonials?approved=true  # publik
- PATCH  /api/testimonials/:id/approve    # admin

## 🧪 Pengujian API
- Rekomendasi: Postman/Insomnia collection.
- Gunakan base URL: http://localhost:4000
- Alur uji cepat:
  1. Register → Login → simpan Bearer token
  2. Admin: buat produk → list produk
  3. Customer: buat order + DP → admin verifikasi → ubah status order → (opsional) testimoni

### Hasil Pembuatan Seluruh Tabel - Database MySQL
<img width="274" height="129" alt="image" src="https://github.com/user-attachments/assets/b3ea3122-c83b-4959-bcb2-8c66458e8716" />

### Routes / Endpoint
<img width="240" height="325" alt="image" src="https://github.com/user-attachments/assets/a84612de-77d0-420c-988c-86d2d1195108" />

### Uji Coba pada POSTMAN
<img width="240" height="152" alt="image" src="https://github.com/user-attachments/assets/eedf585b-db8f-476e-9445-d80a1bb7ead6" /> 
