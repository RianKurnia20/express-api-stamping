# EXPRESS-JWT-USER-AUTHENTICATION

Template backend project yang telah memiliki fitur
1. JsonWebToken
2. Login
3. Logout
4. Register New User
5. Get All User
6. Update User By Id
7. Middleware Perizinan Akses User

## Instalasi

1. Clone repositori ini.
2. Buat file .env untuk koneksi database dan JWT secret key
3. Jalankan perintah `npm install` untuk menginstal dependensi.
4. Jalankan perintah `npm start` untuk memulai proyek.

## Penggunaan

Berikut daftar endpoints yang ada

`/users` (GET, POST)
`/users/:id` (DELETE, PATCH)
`/auth/login` (POST)
`/auth/logout` (POST)