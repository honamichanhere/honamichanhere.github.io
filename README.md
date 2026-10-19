# Review Room

Website review hasil edit untuk client. Video di-host di YouTube (Unlisted), situs di GitHub Pages. Tanpa build step, tanpa dependency.

## Tambah / ubah video
Buka `js/data.js`, tambah satu objek ke `VIDEOS`:

```js
{ id: "slug-unik", yt: "ID_YOUTUBE", title: "Judul", client: "Nama Client",
  category: "Reels", status: "review", date: "2026-10-19", duration: "01:30" }
```

- `yt` = bagian setelah `v=` di link YouTube (upload sebagai **Unlisted**).
- `status` = `approved` | `review` | `revisi`
- `featured: true` untuk tampil di hero.
- Filter client, urutan, dan penomoran otomatis.

Ganti juga `SITE` di file yang sama (nama, nomor WhatsApp, email). Tombol "Kirim revisi" & "Approve" membuka WhatsApp ke nomor itu.

## Catatan revisi
Disimpan di browser client (localStorage), dikirim lewat WhatsApp. Tidak ada server/database.

## Deploy
GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Catatan
- Halaman diberi `noindex`, tapi repo harus **public** agar Pages gratis jalan. Jangan taruh info rahasia di repo.
- Unlisted = siapa pun yang punya link bisa nonton.
