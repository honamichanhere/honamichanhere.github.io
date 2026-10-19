/* =========================================================
   EDIT FILE INI SAJA buat ngatur isi website.
   Teks dua bahasa ditulis { id: "...", en: "..." }.
   Semua isi di bawah ini CONTOH, ganti dengan data lu.
   ========================================================= */

window.SITE = {
  name: "NAMA LU",
  logo: "",                      // path logo, mis. "assets/logo.svg" (kosong = pakai teks nama)
  role: { id: "Video Editor", en: "Video Editor" },
  whatsapp: "6281234567890",     // format internasional tanpa + (kosong = tombol pakai email)
  email: "halo@contoh.com",
  instagram: "",                 // mis. "https://instagram.com/username"
  tiktok: "",
  youtube: "",
  location: "Indonesia",
  showreel: "aqz-KE-bpKQ",       // ID YouTube buat showreel di hero (diputar muted & loop)
  tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop"],
  stats: [
    { n: 120, suffix: "+", label: { id: "Video diedit", en: "Videos edited" } },
    { n: 35,  suffix: "+", label: { id: "Client puas", en: "Happy clients" } },
    { n: 4,   suffix: "",  label: { id: "Tahun pengalaman", en: "Years of experience" } },
    { n: 48,  suffix: "j", label: { id: "Pengerjaan tercepat", en: "Fastest turnaround" } },
  ],
  about: {
    id: "Gua editor yang ngerjain video dari yang pendek sampai panjang: Reels, wedding, company profile, sampai konten YouTube. Fokus gua satu: video lu enak ditonton sampai habis.",
    en: "I edit everything from short-form to long-form: Reels, weddings, company profiles and YouTube content. One focus: making your video worth watching to the very end.",
  },
};

/* Satu objek = satu video.
   yt        : ID video YouTube (bagian setelah v= di link). Boleh Public/Unlisted.
   category  : jenis video (jadi filter otomatis)
   tools     : tools yang dipakai (opsional)
   desc      : deskripsi singkat dua bahasa (opsional)
   featured  : true biar lebih besar di grid (opsional) */
window.VIDEOS = [
  { id: "sintel",   yt: "eRsGyueVLvQ", title: "Sintel — Brand Film",         client: "Northwind",    category: "Brand Film", year: 2026, duration: "14:48", featured: true,
    tools: ["Premiere Pro", "After Effects"],
    desc: { id: "Film brand dengan color grading sinematik dan sound design penuh.", en: "Brand film with cinematic color grading and full sound design." } },
  { id: "bbb",      yt: "aqz-KE-bpKQ", title: "Big Buck Bunny — Recap",      client: "Kopi Senja",   category: "Recap",      year: 2026, duration: "09:56",
    tools: ["DaVinci Resolve"],
    desc: { id: "Recap acara dengan ritme cepat dan transisi halus.", en: "Event recap with a fast rhythm and smooth transitions." } },
  { id: "tears",    yt: "R6MlUcmOul8", title: "Tears of Steel — Teaser",     client: "Northwind",    category: "Teaser",     year: 2026, duration: "12:14",
    tools: ["Premiere Pro", "After Effects"],
    desc: { id: "Teaser berdurasi pendek dengan VFX dan typography bergerak.", en: "Short teaser with VFX and kinetic typography." } },
  { id: "elephants",yt: "TLkA0RELQ1g", title: "Elephants Dream — Reels",     client: "Studio Hijau", category: "Reels",      year: 2025, duration: "10:53",
    tools: ["Premiere Pro"],
    desc: { id: "Konten vertikal dengan caption dinamis buat Reels & TikTok.", en: "Vertical content with dynamic captions for Reels & TikTok." } },
  { id: "spring",   yt: "WhWc3b3KhnY", title: "Spring — Promo Musim Semi",   client: "Kopi Senja",   category: "Promo",      year: 2025, duration: "07:44",
    tools: ["After Effects", "Photoshop"],
    desc: { id: "Video promo produk dengan motion graphic penuh warna.", en: "Product promo with colorful motion graphics." } },
  { id: "cosmos",   yt: "Y-rmzh0PI3c", title: "Cosmos Laundromat — Mini Doc", client: "Studio Hijau", category: "Dokumenter", year: 2025, duration: "12:10",
    tools: ["DaVinci Resolve"],
    desc: { id: "Dokumenter pendek, fokus ke cerita dan pacing.", en: "Short documentary focused on story and pacing." } },
  { id: "wedding",  yt: "eRsGyueVLvQ", title: "Aria & Dimas — Wedding Highlight", client: "Aria & Dimas", category: "Wedding", year: 2025, duration: "14:48",
    tools: ["Premiere Pro", "DaVinci Resolve"],
    desc: { id: "Highlight pernikahan yang emosional, siap dibagikan ke keluarga.", en: "An emotional wedding highlight, ready to share with family." } },
  { id: "gathering",yt: "aqz-KE-bpKQ", title: "Annual Gathering 2026",       client: "Northwind",    category: "Event",      year: 2026, duration: "09:56",
    tools: ["Premiere Pro"],
    desc: { id: "Dokumentasi acara tahunan perusahaan dengan highlight reel.", en: "Annual company event coverage with a highlight reel." } },
];

/* Paket harga. popular: true = diberi highlight neon. Harga cuma teks bebas. */
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
