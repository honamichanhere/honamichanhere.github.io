/* =========================================================
   EDIT FILE INI SAJA buat ngatur isi website.
   ========================================================= */

window.SITE = {
  name: "Nama Lu",                    // nama / brand editor
  role: "Video Editor",
  whatsapp: "6281234567890",          // format internasional tanpa + (contoh: 6281234567890). Kosongin kalau ga mau.
  email: "halo@contoh.com",
  instagram: "",                      // contoh: "https://instagram.com/username"
  year: new Date().getFullYear(),
};

/* Satu objek = satu video.
   yt        : ID video YouTube (bagian setelah v= di link). Upload sebagai UNLISTED.
   client    : nama client (otomatis jadi filter)
   category  : jenis video (Reels, Wedding, Corporate, dll)
   status    : "approved" | "review" | "revisi"
   date      : "YYYY-MM-DD" (dipakai buat urutan, terbaru di atas)
   duration  : teks bebas, mis. "02:14"
   featured  : true biar tampil di hero (opsional)

   Di bawah ini cuma CONTOH pakai video open-source Blender. Ganti semua. */
window.VIDEOS = [
  { id: "sintel-trailer",  yt: "eRsGyueVLvQ", title: "Sintel — Brand Film",        client: "Northwind",   category: "Brand Film",  status: "review",   date: "2026-10-12", duration: "14:48", featured: true },
  { id: "bbb-cut",         yt: "aqz-KE-bpKQ", title: "Big Buck Bunny — Recap",     client: "Kopi Senja",  category: "Recap",       status: "approved", date: "2026-10-04", duration: "09:56", featured: true },
  { id: "tears-teaser",    yt: "R6MlUcmOul8", title: "Tears of Steel — Teaser",    client: "Northwind",   category: "Teaser",      status: "revisi",   date: "2026-09-28", duration: "12:14", featured: true },
  { id: "elephants-reel",  yt: "TLkA0RELQ1g", title: "Elephants Dream — Reels",    client: "Studio Hijau", category: "Reels",      status: "approved", date: "2026-09-19", duration: "10:53" },
  { id: "spring-promo",    yt: "WhWc3b3KhnY", title: "Spring — Promo Musim Semi",  client: "Kopi Senja",  category: "Promo",       status: "review",   date: "2026-09-11", duration: "07:44" },
  { id: "cosmos-doc",      yt: "Y-rmzh0PI3c", title: "Cosmos Laundromat — Mini Doc", client: "Studio Hijau", category: "Dokumenter", status: "approved", date: "2026-08-30", duration: "12:10" },
  { id: "sintel-wedding",  yt: "eRsGyueVLvQ", title: "Aria & Dimas — Wedding Highlight", client: "Aria & Dimas", category: "Wedding", status: "revisi",  date: "2026-08-21", duration: "14:48" },
  { id: "bbb-event",       yt: "aqz-KE-bpKQ", title: "Annual Gathering 2026",      client: "Northwind",   category: "Event",       status: "approved", date: "2026-08-03", duration: "09:56" },
];
