<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Outfit Studio (Fullstack Version)

Aplikasi web bertenaga AI untuk mengganti outfit dalam foto dan mengedit gambar, didukung oleh Google Gemini. Project ini menggunakan arsitektur Fullstack (React Frontend + Node.js/Express Backend).

## Struktur Project

- `client/`: Frontend React + Vite.
- `server/`: Backend Node.js + Express (Menangani API Gemini & Serving Static Files).

## Persyaratan Sistem

- Node.js (v18+)
- NPM
- API Key Google Gemini

## Instalasi & Menjalankan Lokal

1.  **Install Dependencies:**
    Jalankan perintah ini di root folder untuk menginstall dependencies client dan server:
    ```bash
    npm install
    npm run postinstall
    ```

2.  **Konfigurasi Backend:**
    - Masuk ke folder `server`:
      ```bash
      cd server
      cp .env.example .env
      ```
    - Edit file `.env` dan masukkan `GEMINI_API_KEY` Anda.

3.  **Build Frontend:**
    Kembali ke root dan build frontend:
    ```bash
    npm run build
    ```

4.  **Jalankan Server:**
    ```bash
    npm start
    ```
    Aplikasi akan berjalan di `http://localhost:3000`.

## Deployment ke VPS (aaPanel)

Project ini siap di-deploy menggunakan **Node.js Manager** atau **PM2** di aaPanel.

### Langkah-langkah Deployment:

1.  **Upload Code:** Upload seluruh folder project ke VPS Anda.
2.  **Install Dependencies:**
    Masuk ke terminal VPS, arahkan ke folder project, lalu jalankan:
    ```bash
    npm install
    npm run postinstall
    ```
3.  **Setup Environment:**
    Pastikan file `server/.env` sudah dibuat dan berisi API Key.
4.  **Build Frontend:**
    ```bash
    npm run build
    ```
5.  **Jalankan dengan PM2:**
    Anda bisa menggunakan konfigurasi `ecosystem.config.js` yang sudah disediakan.
    ```bash
    pm2 start ecosystem.config.js
    ```
    Atau jika menggunakan interface aaPanel:
    - Tambahkan Node.js Project.
    - Start script: `server/index.js` atau pilih `ecosystem.config.js` jika didukung manager.
    - Port: 3000.

### 6. Konfigurasi Nginx (Reverse Proxy)

Agar aplikasi bisa diakses melalui domain (contoh: `domain-anda.com`), Anda perlu mengatur Reverse Proxy di Nginx.

1.  Di aaPanel, buat **Website** baru (Website > Add Site).
2.  Masukkan domain Anda.
3.  Buka pengaturan website tersebut, lalu masuk ke tab **Config** (atau **Reverse Proxy**).
4.  Jika menggunakan konfigurasi manual, salin isi dari file `nginx.conf.example` ke blok `server { ... }` konfigurasi Nginx Anda.
    - Intinya adalah menambahkan baris `proxy_pass http://127.0.0.1:3000;`.

### Catatan Keamanan
API Key disimpan aman di server (`server/.env`) dan tidak terekspos ke browser pengguna.
