# Portfolio — Honami

Website portofolio video editor: tema kaca hitam dengan aksen neon kuning/orange/merah, dua bahasa (ID/EN), daftar karya, harga, proses, FAQ, dan kontak. Video di-host di YouTube, situs di GitHub Pages. Tanpa build step.

## Cara menambah video (paling gampang)

1. Upload videonya ke YouTube (Public atau Unlisted).
2. Buka file **`js/data.js`** di GitHub (klik file → ikon pensil ✏️).
3. Cari `window.VIDEOS = [`, lalu salin satu baris ini dan tempel di bawah baris terakhir (sebelum tanda `];`):

```js
{ yt: "LINK_YOUTUBE", client: "Nama Client", category: "Reels", views: 1200, uploaded: "2026-10-19" },
```

4. Ganti isinya, lalu klik **Commit changes**. Tunggu 1–2 menit, website otomatis update.

| Kolom | Isi |
|---|---|
| `yt` | Link YouTube lengkap atau ID-nya saja. **Wajib** |
| `category` | Jenis video (Reels, Wedding, dll). Otomatis jadi tombol filter. **Wajib** |
| `client` | Nama client (opsional) |
| `views` | Jumlah tayang, angka biasa tanpa titik: `1200` |
| `uploaded` | Tanggal upload `TAHUN-BULAN-TANGGAL` |
| `title` | Judul. **Kalau dikosongkan, diambil otomatis dari YouTube** |
| `duration` | Durasi, mis. `"01:30"` (opsional) |
| `tools` | Mis. `["After Effects", "CapCut"]` (opsional) |
| `desc` | Deskripsi dua bahasa `{ id: "...", en: "..." }` (opsional) |
| `featured` | `true` = jadi kartu besar (cukup satu video) |

Urutan video otomatis dari yang terbaru. Statistik di hero (jumlah video, total tayang, jumlah client) **dihitung otomatis** dari daftar ini. Kalau auto-update dinyalakan (lihat bawah), `views` dan data lain diisi otomatis dari YouTube dan menimpa angka manual.

## Bagian lain di `js/data.js`
- `SITE` — nama, logo, WhatsApp, email, sosmed, showreel, tools, teks "Tentang"
- `PRICING` — paket harga (**masih contoh**)
- `FAQ` — pertanyaan umum (**masih contoh**)

Semua yang bertanda `[CONTOH]` masih template, ganti kalau sudah siap. Teks UI (judul, tombol) ada di `js/i18n.js`. Teks dua bahasa ditulis `{ id: "...", en: "..." }`.

## Deploy
GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Update otomatis dari YouTube (tayang, judul, tanggal, durasi)

GitHub Action `.github/workflows/update-stats.yml` jalan tiap 6 jam, mengambil data semua video di `js/data.js` dari YouTube Data API, lalu menyimpannya ke `js/stats.json`. Website membaca file itu otomatis.

**Setup sekali saja:**
1. Buka https://console.cloud.google.com → buat project baru.
2. APIs & Services → Library → aktifkan **YouTube Data API v3**.
3. APIs & Services → Credentials → Create credentials → **API key**. (Disarankan: batasi key ke YouTube Data API v3.)
4. Di repo GitHub: Settings → Secrets and variables → Actions → New repository secret. Name: `YT_API_KEY`, isi: key tadi.
5. Tab Actions → "Update video stats" → Run workflow (buat tes pertama).

Key disimpan sebagai secret, tidak pernah muncul di website. Tanpa key, website tetap jalan memakai angka manual.
