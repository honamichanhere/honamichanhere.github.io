/* =========================================================
   EDIT FILE INI SAJA buat ngatur isi website.
   Teks dua bahasa ditulis { id: "...", en: "..." }.
   Bagian bertanda [CONTOH] masih template, ganti kalau udah siap.
   ========================================================= */

window.SITE = {
  name: "Honami",
  logo: "assets/logo.png",       // path logo/foto profil (ganti file assets/logo.png, atau kosongkan = pakai teks nama)
  role: { id: "Video Editor", en: "Video Editor" },
  whatsapp: "6288986045729",     // format internasional tanpa + dan spasi
  email: "ichinosehonamisan16@gmail.com",
  instagram: "https://www.instagram.com/afiksptra_",
  tiktok: "https://www.tiktok.com/@honamichanhere",
  youtube: "https://www.youtube.com/@honamihere",
  location: "Indonesia",
  showreel: "aqz-KE-bpKQ",       // [CONTOH] ID/link YouTube buat showreel di hero (diputar muted & loop)
  tools: ["After Effects", "CapCut", "Topaz Video AI"],

  /* Statistik di hero. Yang pakai auto: dihitung OTOMATIS dari daftar video di bawah.
     auto: "videos"  = jumlah video   | "clients" = jumlah client unik | "views" = total tayang
     Yang tanpa auto isi manual dengan n (angka) dan suffix. */
  stats: [
    { auto: "videos" },
    { auto: "views" },
    { auto: "clients" },
    { n: 1, suffix: "+", label: { id: "Tahun pengalaman", en: "Years of experience" } },   // [CONTOH] isi manual
  ],

  /* [CONTOH] Teks "Tentang" — ganti dengan cerita lu */
  about: {
    id: "Halo, gua Honami. Gua ngedit video dari yang pendek sampai panjang. Fokus gua satu: bikin video lu enak ditonton sampai habis. (Teks ini contoh, ganti dengan cerita lu.)",
    en: "Hi, I'm Honami. I edit videos from short-form to long-form, with one focus: making your video worth watching to the very end. (This is placeholder text, replace it with your story.)",
  },
};

/* =========================================================
   DAFTAR VIDEO
   Cara paling gampang nambah video: salin SATU baris di bawah ini, tempel di bawah
   baris terakhir, lalu ganti isinya.

   { yt: "LINK_ATAU_ID_YOUTUBE", client: "Nama Client", category: "Reels", views: 1200, uploaded: "2026-10-01" },

   Wajib   : yt (boleh link penuh atau ID-nya saja), category
   Disarankan: client, views (jumlah tayang), uploaded (tanggal upload, format TAHUN-BULAN-TANGGAL)
   Opsional : title   (kalau kosong, judul diambil OTOMATIS dari YouTube)
              duration (mis. "01:30")
              tools    (mis. ["After Effects", "CapCut"])
              desc     ({ id: "...", en: "..." })
              featured: true  (jadi kartu besar di grid, cukup satu video)
   Kategori otomatis jadi tombol filter. Urutan otomatis dari yang terbaru.
   ========================================================= */
window.VIDEOS = [
  /* [CONTOH] semua video di bawah ini cuma contoh pakai film open-source Blender. Hapus lalu ganti. */
  { yt: "eRsGyueVLvQ", title: "Sintel — Brand Film", client: "Northwind", category: "Brand Film", views: 48200, uploaded: "2026-10-12", duration: "14:48", featured: true,
    tools: ["After Effects", "Topaz Video AI"],
    desc: { id: "Film brand dengan color grading sinematik dan sound design penuh.", en: "Brand film with cinematic color grading and full sound design." } },
  { yt: "aqz-KE-bpKQ", title: "Big Buck Bunny — Recap", client: "Kopi Senja", category: "Recap", views: 12800, uploaded: "2026-10-04", duration: "09:56",
    tools: ["CapCut"],
    desc: { id: "Recap acara dengan ritme cepat dan transisi halus.", en: "Event recap with a fast rhythm and smooth transitions." } },
  { yt: "R6MlUcmOul8", title: "Tears of Steel — Teaser", client: "Northwind", category: "Teaser", views: 9300, uploaded: "2026-09-28", duration: "12:14",
    tools: ["After Effects"],
    desc: { id: "Teaser berdurasi pendek dengan VFX dan typography bergerak.", en: "Short teaser with VFX and kinetic typography." } },
  { yt: "TLkA0RELQ1g", title: "Elephants Dream — Reels", client: "Studio Hijau", category: "Reels", views: 150400, uploaded: "2026-08-19", duration: "10:53",
    tools: ["CapCut"],
    desc: { id: "Konten vertikal dengan caption dinamis buat Reels & TikTok.", en: "Vertical content with dynamic captions for Reels & TikTok." } },
  { yt: "WhWc3b3KhnY", title: "Spring — Promo Musim Semi", client: "Kopi Senja", category: "Promo", views: 7600, uploaded: "2026-07-11", duration: "07:44",
    tools: ["After Effects", "CapCut"],
    desc: { id: "Video promo produk dengan motion graphic penuh warna.", en: "Product promo with colorful motion graphics." } },
  { yt: "Y-rmzh0PI3c", title: "Cosmos Laundromat — Mini Doc", client: "Studio Hijau", category: "Dokumenter", views: 21900, uploaded: "2026-05-30", duration: "12:10",
    tools: ["After Effects", "Topaz Video AI"],
    desc: { id: "Dokumenter pendek, fokus ke cerita dan pacing.", en: "Short documentary focused on story and pacing." } },
  { yt: "eRsGyueVLvQ", title: "Aria & Dimas — Wedding Highlight", client: "Aria & Dimas", category: "Wedding", views: 3400, uploaded: "2026-02-21", duration: "14:48",
    tools: ["CapCut", "Topaz Video AI"],
    desc: { id: "Highlight pernikahan yang emosional, siap dibagikan ke keluarga.", en: "An emotional wedding highlight, ready to share with family." } },
  { yt: "aqz-KE-bpKQ", title: "Annual Gathering 2025", client: "Northwind", category: "Event", views: 5100, uploaded: "2025-11-03", duration: "09:56",
    tools: ["CapCut"],
    desc: { id: "Dokumentasi acara tahunan perusahaan dengan highlight reel.", en: "Annual company event coverage with a highlight reel." } },
];

/* [CONTOH] Paket harga. popular: true = diberi highlight neon. Harga cuma teks bebas. */
window.PRICING = [
  { name: { id: "Short", en: "Short" }, price: "Rp 150rb", unit: { id: "/ video", en: "/ video" },
    desc: { id: "Konten pendek buat Reels, TikTok, Shorts.", en: "Short-form for Reels, TikTok, Shorts." },
    features: [
      { id: "Durasi sampai 60 detik", en: "Up to 60 seconds" },
      { id: "Caption & efek dasar", en: "Captions & basic effects" },
      { id: "2x revisi", en: "2 revisions" },
      { id: "Selesai 2 hari", en: "2-day delivery" },
    ] },
  { name: { id: "Pro", en: "Pro" }, price: "Rp 500rb", unit: { id: "/ video", en: "/ video" }, popular: true,
    desc: { id: "Video promosi atau YouTube dengan polesan penuh.", en: "Promo or YouTube video with full polish." },
    features: [
      { id: "Durasi sampai 5 menit", en: "Up to 5 minutes" },
      { id: "Color grading & sound design", en: "Color grading & sound design" },
      { id: "Motion graphic", en: "Motion graphics" },
      { id: "3x revisi", en: "3 revisions" },
    ] },
  { name: { id: "Cinematic", en: "Cinematic" }, price: "Rp 1,5jt", unit: { id: "mulai dari", en: "starting at" },
    desc: { id: "Wedding, brand film, dan proyek besar.", en: "Weddings, brand films and large projects." },
    features: [
      { id: "Durasi bebas", en: "Any duration" },
      { id: "Grading sinematik + VFX", en: "Cinematic grading + VFX" },
      { id: "Revisi sampai puas", en: "Revisions until you're happy" },
      { id: "Prioritas pengerjaan", en: "Priority turnaround" },
    ] },
];

/* [CONTOH] FAQ */
window.FAQ = [
  { q: { id: "Berapa lama pengerjaannya?", en: "How long does it take?" },
    a: { id: "Video pendek biasanya 1–2 hari, video panjang atau proyek besar 3–7 hari tergantung durasi dan tingkat kerumitan.", en: "Short videos usually take 1–2 days. Longer or bigger projects take 3–7 days depending on length and complexity." } },
  { q: { id: "Revisi dapat berapa kali?", en: "How many revisions do I get?" },
    a: { id: "Sesuai paket. Revisi kecil (teks, potongan) bebas selama masih dalam brief awal.", en: "Depends on the package. Small tweaks (text, trims) are free as long as they stay within the original brief." } },
  { q: { id: "Aku perlu kirim apa?", en: "What do I need to send?" },
    a: { id: "Footage mentah, referensi video yang kamu suka, logo/font brand kalau ada, dan brief singkat.", en: "Raw footage, reference videos you like, brand logo/fonts if any, and a short brief." } },
  { q: { id: "Pembayarannya gimana?", en: "How does payment work?" },
    a: { id: "DP 50% di awal, pelunasan sebelum file final dikirim.", en: "50% upfront, the rest before the final files are delivered." } },
];
