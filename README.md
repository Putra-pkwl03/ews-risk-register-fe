

# ?? Frontend  ? React + Next.js (Terhubung Laravel JWT)


## ??? Persyaratan

- Node.js v16+ (disarankan)
- Laravel backend (dengan JWT) aktif di `http://localhost:8000`

---

## ?? Instalasi

### 1. Clone repositori ini

```bash
git clone https://github.com/nama-user/nama-repo.git
cd nama-repo
````

### 2. Install dependency

```bash
npm install
```

---

## ?? Menjalankan Aplikasi

```bash
npm run dev
```

Akses di: [http://localhost:3000](http://localhost:3000)

---

## ?? Login

1. Jalankan backend Laravel (`php artisan serve`)
2. Akses `http://localhost:3000/login`
3. Masukkan email & password yang valid dari Laravel
4. Jika berhasil, akan diarahkan ke `/dashboard`

---

## ?? Konfigurasi Axios (Token Otomatis)

Axios sudah dikonfigurasi untuk otomatis mengirim JWT ke backend Laravel:

```js
// lib/api.js
const api = axios.create({ baseURL: 'http://localhost:8000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ?? Struktur Folder Penting

```
/lib/api.js            # Konfigurasi Axios + token
/app/login/page.js     # Halaman login
/app/dashboard/page.js # Halaman dashboard setelah login
```

---

## ?? Logout

Untuk logout:

* Hapus token dari `localStorage` secara manual atau
* Tambahkan tombol logout yang memanggil endpoint Laravel `/logout` dan menghapus token

---

## ? Troubleshooting

* Jika login gagal, pastikan:

  * Email dan password sudah terdaftar di Laravel
  * Backend Laravel berjalan di `http://localhost:8000`
  * CORS backend mengizinkan akses dari frontend

Contoh konfigurasi `config/cors.php` Laravel:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
```

--

