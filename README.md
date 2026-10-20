# Honami — Link in Bio

Website link-in-bio dengan tema kaca hitam + aksen neon kuning/orange/merah, dua bahasa (ID/EN). Blok dengan pintasan yang selalu tampil di atas:

| Blok | Isi |
|---|---|
| **Biodata** | Banner, profil, badge, bio, tools, statistik otomatis, tombol link utama (WA, IG, TikTok, YouTube, Discord, Email) |
| **Discover** | Blok sorotan di bawah Biodata. **Hanya muncul kalau ada item** yang diberi `discover` |
| **Edit** | Showcase video dalam dua tab: **Client** dan **Konten Sendiri**. Hover video di desktop = preview. Ada panel ringkas Harga / Cara kerja / FAQ |
| **Store** | Etalase aset digital. Klik kartu = popup detail (thumbnail geser, deskripsi lengkap, harga, tombol Buy ke Avora) |
| **Other** | Script & Tools, video tutorial, game Roblox (dengan pemain & visit otomatis), dan link lain |

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
| `ratio` | Rasio video, mis. `"9:16"`, `"1:1"`, `"3:4"`, `"4:3"`, `"16:9"` (opsional). **Kosong = terdeteksi otomatis** dari gambar rasio asli YouTube |
| `tools`, `desc` | Tools yang dipakai & deskripsi `{ id: "...", en: "..." }` (opsional) |
| `featured` | `true` = tampil paling depan |

**Tombol See more:** halaman hanya menampilkan 10 video (dan 10 produk di Store) langsung. Kalau lebih, muncul tombol "See N more" yang membuka sisanya seperti dropdown, lalu berganti jadi "Show less" untuk menyembunyikannya lagi. Ubah jumlahnya lewat `showLimit` di `SITE` (`js/data.js`).

**Rasio video:** pemutar mengikuti rasio asli video (16:9, 9:16, 1:1, 3:4, 4:3, 4:5, dan rasio lain). Di kartu, video yang lebih tinggi dari 16:9 (Shorts, Reels) ditampilkan utuh di kotak yang sama, tidak dipotong, jadi susunan grid tetap rapi. Rasio dideteksi otomatis (GitHub Action menyimpannya di `js/stats.json`, dan browser juga mengeceknya langsung), isi `ratio` hanya kalau perlu.

Preview hover hanya jalan di desktop. Di HP, ketuk kartu langsung membuka pemutar. Video harus **boleh di-embed** di pengaturan YouTube.

## Discover (item sorotan)
Tambahkan `discover: true` (atau angka urutan, 1 = paling depan) ke item mana pun di `js/data.js`: video di `VIDEOS`, produk di `PRODUCTS`, script di `SCRIPTS`, atau game di `GAMES`. Item itu tetap tampil di tempat aslinya, dan **juga** muncul di blok Discover dengan label Spotlight. Kalau tidak ada item bertanda, blok Discover dan menunya otomatis hilang.

## Script & Tools (blok Other)
`SCRIPTS` di `js/data.js`. Kartu di Other dan Discover membuka popup detail: gambar yang bisa digeser, deskripsi, loader dengan tombol **Salin script**, game yang didukung, fitur, panduan (bisa dilipat), dan catatan. Kolom: `name`, `header`, `desc`, `status`, `images`, `loader`, `games`, `features`, `pricing` (daftar harga langganan + tombol order), `steps`, `guide`, `note`, `discover`. Taruh gambar di `assets/other/`.

**Deskripsi video otomatis:** kalau video tidak punya `desc`, deskripsinya diambil otomatis dari YouTube (GitHub Action ikut memperbaruinya, link di dalamnya jadi bisa diklik). Isi `desc` kalau mau memakai teks sendiri.

**Video tutorial / non-showcase:** beri `type: "other"` pada video. Ia tampil di Other (bagian Tutorial & Video), tidak masuk tab Edit dan tidak dihitung di statistik.

## Link utama & Other
- `SITE` — nama, `logo` (foto profil), `banner`, `role` (judul di bawah nama), `badges`, `tools`, `about`, `stats`.
- `LINKS` — tombol di blok Biodata. `icon`: `wa ig tt yt discord mail roblox store link`. `url` kosong = disembunyikan. `copy: true` = klik menyalin alamat email (dipakai untuk Email).
- `OTHER_LINKS` — link tambahan di blok Other.
- `GAMES` — game Roblox. Isi `placeId` (angka di link `roblox.com/games/ANGKA/...`) supaya gambar, jumlah pemain, dan visit otomatis. Atau isi `image` manual.

## Store
`PRODUCTS` di `js/data.js`. Kartu menampilkan thumbnail, title, header, harga, dan tombol **See Item**. Klik kartu membuka popup detail dengan thumbnail yang bisa digeser, deskripsi lengkap, harga, dan tombol **Buy**.

| Kolom | Isi |
|---|---|
| `name` | Judul produk |
| `header` | Kalimat pendek di bawah judul |
| `price` | Harga (teks bebas) |
| `images` | Daftar gambar, mis. `["assets/store/a.webp", "assets/store/b.webp"]`. Yang pertama jadi thumbnail kartu. Kosong = gambar otomatis |
| `desc` | Deskripsi lengkap, baris baru dengan `
` |
| `url` | Link produk di Avora (tombol Buy) |
| `tag` | Label, otomatis jadi filter |

Taruh gambar produk di folder `assets/store/` (disarankan WebP, di bawah 200 KB per gambar). Pembayaran dan pengiriman file diurus Avora. **Jangan simpan file aset berbayar di repo ini** (repo-nya public).

## Update otomatis (YouTube + Roblox + jumlah terjual Avora)
GitHub Action `.github/workflows/update-stats.yml` jalan **tiap jam** (GitHub bisa menunda beberapa menit) dan setiap `js/data.js` berubah. Ia mengisi `js/stats.json` (dibaca website otomatis). Setelah file berubah, situs ter-deploy ulang (sekitar 1–3 menit), jadi angka di situs bisa tertinggal sampai ±1 jam 3 menit.

**Judul, harga, dan harga coret (Avora):** untuk produk dengan link `https://avora.id/...`, judul dan harga (termasuk harga coret kalau ada diskon) ikut dicerminkan dari halaman Avora tiap jam. `name` dan `price` di `data.js` jadi cadangan; tambah `mirror: false` di produk kalau mau memakai nilai di `data.js` saja. Deskripsi dan gambar produk tetap manual.

**Jumlah terjual (Avora):** Avora belum punya API, jadi script membaca teks "N orang sudah beli" dari halaman produk publik yang ada di `url` produk (hanya link `https://avora.id/...`, 1 permintaan per produk per jam). Kalau Avora mengubah tampilannya dan teks itu tidak ketemu, angka terakhir tetap dipakai (dan `sold` manual di data jadi cadangan); situs tidak rusak. Kalau Avora nanti merilis API, pembacaan ini bisa diganti.

**Setup YouTube (sekali saja):**
1. https://console.cloud.google.com → buat project → aktifkan **YouTube Data API v3**.
2. Credentials → Create credentials → **API key**. Application restrictions: **None**. API restrictions: **YouTube Data API v3**.
3. Repo GitHub → Settings → Secrets and variables → Actions → secret `YT_API_KEY`.

Roblox memakai API publik, tidak butuh key.

## Deploy
GitHub Pages lewat workflow `.github/workflows/pages.yml` (otomatis setiap push ke `main`).
