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

Urutan video otomatis dari yang terbaru. Statistik di hero (jumlah video, total tayang, jumlah client) **dihitung otomatis** dari daftar ini. Jumlah tayang di YouTube berubah terus, jadi angka `views` perlu kamu update manual sesekali.

## Bagian lain di `js/data.js`
- `SITE` — nama, logo, WhatsApp, email, sosmed, showreel, tools, teks "Tentang"
- `PRICING` — paket harga (**masih contoh**)
- `FAQ` — pertanyaan umum (**masih contoh**)

Semua yang bertanda `[CONTOH]` masih template, ganti kalau sudah siap. Teks UI (judul, tombol) ada di `js/i18n.js`. Teks dua bahasa ditulis `{ id: "...", en: "..." }`.

## Deploy
GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
