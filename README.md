# Portfolio — Video Editor

Website portofolio publik dengan tema kaca neon (hitam + kuning/orange/merah), dua bahasa (ID/EN), daftar karya, harga, proses, FAQ dan kontak. Video di-host di YouTube, situs di GitHub Pages. Tanpa build step.

## Edit isi
Semua konten ada di `js/data.js`:
- `SITE` — nama, logo, WhatsApp, email, sosmed, showreel, statistik, tentang, tools
- `VIDEOS` — daftar karya (ID YouTube, client, kategori, tahun, tools, deskripsi). Kategori jadi filter otomatis
- `PRICING` — paket harga
- `FAQ` — pertanyaan umum

Teks UI (judul, tombol) ada di `js/i18n.js`. Teks dua bahasa ditulis `{ id: "...", en: "..." }`.

Tombol "Pesan edit kayak gini" dan "Pilih paket" membuka WhatsApp dengan pesan otomatis (atau email kalau nomor WhatsApp kosong).

## Deploy
GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
