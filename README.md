<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Outfit Studio

Aplikasi web bertenaga AI untuk mengganti outfit dalam foto dan mengedit gambar menggunakan perintah teks, didukung oleh Google Gemini (via Google GenAI SDK).

## Persyaratan Sistem

- Node.js (v18 atau lebih baru direkomendasikan)
- NPM (biasanya terinstall bersama Node.js)
- API Key Google Gemini (Dapatkan di [Google AI Studio](https://aistudio.google.com/))

## Instalasi & Menjalankan Lokal

1.  **Clone repository** (jika belum):
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment:**
    - Buat file `.env` (atau `.env.local`) di root project.
    - Salin isi dari `.env.example` atau tambahkan baris berikut:
      ```env
      GEMINI_API_KEY=your_actual_api_key_here
      ```
    > **PENTING:** Jangan pernah commit file `.env` atau `.env.local` yang berisi API Key asli ke version control.

4.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:3000` (atau port lain yang tersedia).

## Deployment

Aplikasi ini adalah Single Page Application (SPA) berbasis Vite + React.

### Deploy ke Vercel (Disarankan)

Repository ini sudah dilengkapi dengan konfigurasi `vercel.json`.

1.  Push kode ke GitHub/GitLab/Bitbucket.
2.  Import project ke Vercel.
3.  Di pengaturan Vercel, tambahkan Environment Variable:
    - Name: `GEMINI_API_KEY`
    - Value: `API_KEY_ANDA`
4.  Deploy!

### Deploy Manual / VPS

1.  **Build aplikasi:**
    ```bash
    npm run build
    ```
    Hasil build akan berada di folder `dist/`.

2.  **Serve folder `dist/`:**
    Anda bisa menggunakan web server apa saja (Nginx, Apache, serve).
    Contoh menggunakan `serve`:
    ```bash
    npm install -g serve
    serve -s dist
    ```

## ⚠️ Peringatan Keamanan

Aplikasi ini berjalan sepenuhnya di sisi klien (browser). Ini berarti **API Key Anda akan terekspos** ke pengguna yang menginspeksi network request atau source code.

- **Untuk penggunaan pribadi/demo:** Ini biasanya dapat diterima asalkan Anda menjaga URL tetap privat atau membatasi kuota API key.
- **Untuk produksi publik:** Sangat disarankan untuk memindahkan logika pemanggilan API ke backend server (proxy) untuk menyembunyikan API Key Anda.
