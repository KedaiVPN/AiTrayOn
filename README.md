<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Outfit Studio

Aplikasi web bertenaga AI untuk mengganti outfit dalam foto dan mengedit gambar menggunakan perintah teks.

Versi ini telah diperbarui untuk menggunakan **Puter.js**, yang memungkinkan akses ke model AI canggih (seperti Google Gemini) **tanpa perlu API Key** dan **tanpa konfigurasi backend**.

## Fitur Utama

-   **Tanpa API Key:** Menggunakan infrastruktur Puter.js yang menangani otentikasi AI.
-   **User-Pays Model:** Penggunaan AI dibebankan kepada user (akun Puter) secara otomatis, atau gratis untuk penggunaan dasar (tergantung kebijakan Puter).
-   **Client-Side Only:** Tidak ada server backend yang perlu diurus. Bisa di-deploy di static hosting mana saja.

## Persyaratan Sistem

-   Node.js (v18 atau lebih baru direkomendasikan)
-   NPM (biasanya terinstall bersama Node.js)

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

3.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:3000`.

## Deployment

Aplikasi ini adalah Single Page Application (SPA) berbasis Vite + React dan 100% statis.

### Deploy ke Vercel (Disarankan)

1.  Push kode ke GitHub/GitLab/Bitbucket.
2.  Import project ke Vercel.
3.  Deploy! (Tidak perlu setting Environment Variable apapun).

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

## Catatan Teknis

Aplikasi ini menggunakan `puter.js` yang dimuat via CDN di `index.html`. Library ini menjembatani komunikasi ke model AI secara aman dari browser.
