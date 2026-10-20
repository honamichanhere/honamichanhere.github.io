# Honami — Link in Bio

Website link-in-bio dengan tema kaca hitam + aksen neon kuning/orange/merah, dua bahasa (ID/EN). Empat blok dengan pintasan yang selalu tampil di atas:

| Blok | Isi |
|---|---|
| **Biodata** | Profil, badge, bio, statistik otomatis, tombol link utama (WA, IG, TikTok, YouTube, Discord, Email) |
| **Edit** | Showcase video dalam dua tab: **Client** dan **Konten Sendiri**. Hover video di desktop = preview. Ada panel ringkas Harga / Cara kerja / FAQ |
| **Store** | Etalase aset digital, tombol Buy / See item mengarah ke Avora |
| **Other** | Game Roblox (dengan pemain & visit otomatis) dan link lain |

Video di-host di YouTube, situs di GitHub Pages. Tanpa build step. Semua isi diatur dari **`js/data.js`**.

> **Kembali ke versi lama:** tag `stable-checkpoint-1` (landing portofolio sebelum jadi link-in-bio).
> Lihat https://github.com/honamichanhere/honamichanhere.github.io/releases/tag/stable-checkpoint-1

## Menambah video (blok Edit)

Buka `js/data.js` di GitHub (klik file → ikon pensil ✏️), salin satu baris ini ke bawah baris terakhir di `window.VIDEOS`, ganti isinya, lalu **Commit changes**. Situs update dalam 1–2 menit.

```js
{ yt: "LINK_YOUTUBE", type: "client", client: "Nama Client", category: "Reels", uploaded: "2026-10-19" },
```

| Kolom | Isi |
|---|---|
| `yt` | Link YouTube lengkap atau ID. **Wajib** |
| `category` | Jenis video, otomatis jadi tombol filter. **Wajib** |
| `type` | `"client"` (hasil edit buat client) atau `"own"` (konten sendiri). Kosong = client |
| `client` | Nama client (opsional) |
| `title` | Kosong = judul diambil otomatis dari YouTube |
| `views`, `uploaded`, `duration` | Diisi otomatis oleh GitHub Action kalau `YT_API_KEY` sudah dipasang (angka manual jadi cadangan) |
| `preview` | Detik mulai preview saat hover di desktop (opsional) |
| `tools`, `desc` | Tools yang dipakai & deskripsi `{ id: "...", en: "..." }` (opsional) |
| `featured` | `true` = tampil paling depan |

Preview hover hanya jalan di desktop. Di HP, ketuk kartu langsung membuka pemutar. Video harus **boleh di-embed** di pengaturan YouTube.

## Link utama & Other
- `LINKS` — tombol di blok Biodata. `icon`: `wa ig tt yt discord mail roblox store link`. `url` kosong = disembunyikan.
- `OTHER_LINKS` — link tambahan di blok Other.
- `GAMES` — game Roblox. Isi `placeId` (angka di link `roblox.com/games/ANGKA/...`) supaya gambar, jumlah pemain, dan visit otomatis. Atau isi `image` manual.

## Store
`PRODUCTS` di `js/data.js`. Tiap produk: `name`, `tag` (jadi filter), `price`, `image` (opsional), `desc`, `cta` (`"buy"` atau `"see"`), dan `url` (link produk di Avora). Pembayaran dan pengiriman file diurus Avora. **Jangan simpan file aset berbayar di repo ini** (repo-nya public).

## Update otomatis (YouTube + Roblox)
GitHub Action `.github/workflows/update-stats.yml` jalan tiap 6 jam dan setiap `js/data.js` berubah. Ia mengisi `js/stats.json` (dibaca website otomatis).

**Setup YouTube (sekali saja):**
1. https://console.cloud.google.com → buat project → aktifkan **YouTube Data API v3**.
2. Credentials → Create credentials → **API key**. Application restrictions: **None**. API restrictions: **YouTube Data API v3**.
3. Repo GitHub → Settings → Secrets and variables → Actions → secret `YT_API_KEY`.

Roblox memakai API publik, tidak butuh key.

## Deploy
GitHub Pages lewat workflow `.github/workflows/pages.yml` (otomatis setiap push ke `main`).
