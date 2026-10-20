/* =========================================================
   EDIT FILE INI SAJA buat ngatur isi website.
   Teks dua bahasa ditulis { id: "...", en: "..." }.
   Bagian bertanda [CONTOH] masih template, ganti kalau udah siap.
   ========================================================= */

window.SITE = {
  name: "Honami",
  logo: "assets/logo.jpg",       // foto profil / logo (ganti file assets/logo.jpg, ukuran cukup 256x256)
  banner: "assets/banner.webp",  // banner di atas kartu profil (kosong = tanpa banner)
  role: { id: "Roblox Technical Artist", en: "Roblox Technical Artist" },   // judul di bawah nama
  whatsapp: "6288986045729",     // format internasional tanpa + dan spasi (dipakai tombol "Pesan edit")
  email: "ichinosehonamisan16@gmail.com",
  location: "Indonesia",
  showLimit: 10,                 // jumlah video / produk yang langsung tampil. Sisanya masuk tombol "See more"
  tools: ["After Effects", "CapCut", "Topaz Video AI", "Roblox Studio"],

  /* Badge kecil di bawah nama */
  badges: [
    { id: "Roblox Development", en: "Roblox Development" },
    { id: "Programmer", en: "Programmer" },
    { id: "Photo/Video Editing", en: "Photo/Video Editing" },
  ],

  /* [CONTOH] Bio singkat — ganti dengan ceritamu */
  about: {
    id: "Halo, gua Honami. Gua ngedit video dari yang pendek sampai panjang, bikin game Roblox, dan jualan aset digital.",
    en: "Hi, I'm Honami. I edit videos from short to long-form, build Roblox games and sell digital assets.",
  },

  /* Statistik. auto: "videos" | "clients" | "views" dihitung otomatis dari VIDEOS. Tanpa auto = isi manual. */
  stats: [
    { auto: "videos" },
    { auto: "views" },
    { auto: "clients" },
    { n: 1, suffix: "+", label: { id: "Tahun pengalaman", en: "Years of experience" } },   // [CONTOH]
  ],
};

/* =========================================================
   TOMBOL LINK UTAMA (di blok Biodata, kayak Linktree)
   icon: wa | ig | tt | yt | discord | mail | roblox | store | link
   url kosong ("") = tombolnya otomatis disembunyikan
   ========================================================= */
window.LINKS = [
  { label: "WhatsApp",  sub: { id: "Chat langsung", en: "Chat directly" }, icon: "wa",      url: "https://wa.me/6288986045729", primary: true },
  { label: "Instagram", sub: "@afiksptra_",                                  icon: "ig",      url: "https://www.instagram.com/afiksptra_" },
  { label: "TikTok",    sub: "@honamichanhere",                              icon: "tt",      url: "https://www.tiktok.com/@honamichanhere" },
  { label: "YouTube",   sub: "@honamihere",                                  icon: "yt",      url: "https://www.youtube.com/@honamihere" },
  { label: "Discord",   sub: { id: "Gabung komunitas", en: "Join the community" }, icon: "discord", url: "" },   // [CONTOH] isi link server Discord
  { label: "Email",     sub: "ichinosehonamisan16@gmail.com",                icon: "mail",    url: "mailto:ichinosehonamisan16@gmail.com", copy: true },   // copy: true = klik menyalin alamat email
];

/* =========================================================
   DAFTAR VIDEO (blok Edit)
   Salin SATU baris, tempel di bawah baris terakhir, lalu ganti isinya:

   { yt: "LINK_YOUTUBE", type: "client", client: "Nama Client", category: "Reels", views: 1200, uploaded: "2026-10-19" },

   Wajib     : yt (link penuh atau ID), category
   type      : "client" (hasil edit buat client) atau "own" (konten sendiri). Kosong = "client"
               "other" = bukan showcase edit (mis. tutorial). Tampil di blok Other, tidak masuk hitungan statistik
   discover  : true atau angka urutan (1 = paling depan) = ikut tampil di blok Discover (sorotan)
   Disarankan: client, views, uploaded (TAHUN-BULAN-TANGGAL)
   Opsional  : title (kosong = otomatis dari YouTube), duration, tools, desc {id,en},
               preview (detik mulai preview saat hover di desktop), featured: true
   Tayang, judul, tanggal, durasi diisi otomatis oleh GitHub Action (lihat README).
   ========================================================= */
window.VIDEOS = [
  /* Tutorial script Mugiwara HUB (tampil di Other + Discover). Judul, tayang, tanggal, durasi diisi otomatis dari YouTube */
  { yt: "https://www.youtube.com/watch?v=64MjgGJADjA", type: "other", category: "Tutorial", discover: 2 },

  /* [CONTOH] video di bawah ini cuma contoh pakai film open-source Blender. Hapus lalu ganti. */
  { yt: "eRsGyueVLvQ", type: "client", title: "Sintel — Brand Film", client: "Northwind", category: "Brand Film", views: 48200, uploaded: "2026-10-12", duration: "14:48", featured: true, preview: 60,
    tools: ["After Effects", "Topaz Video AI"],
    desc: { id: "Film brand dengan color grading sinematik dan sound design penuh.", en: "Brand film with cinematic color grading and full sound design." } },
  { yt: "aqz-KE-bpKQ", type: "client", title: "Big Buck Bunny — Recap", client: "Kopi Senja", category: "Recap", views: 12800, uploaded: "2026-10-04", duration: "09:56", preview: 20,
    tools: ["CapCut"],
    desc: { id: "Recap acara dengan ritme cepat dan transisi halus.", en: "Event recap with a fast rhythm and smooth transitions." } },
  { yt: "R6MlUcmOul8", type: "client", title: "Tears of Steel — Teaser", client: "Northwind", category: "Teaser", views: 9300, uploaded: "2026-09-28", duration: "12:14", preview: 90,
    tools: ["After Effects"],
    desc: { id: "Teaser berdurasi pendek dengan VFX dan typography bergerak.", en: "Short teaser with VFX and kinetic typography." } },
  { yt: "TLkA0RELQ1g", type: "own", title: "Elephants Dream — Edit Pribadi", client: "", category: "Reels", views: 150400, uploaded: "2026-08-19", duration: "10:53", preview: 45,
    tools: ["CapCut"],
    desc: { id: "Konten sendiri dengan caption dinamis buat Reels & TikTok.", en: "Personal content with dynamic captions for Reels & TikTok." } },
  { yt: "WhWc3b3KhnY", type: "client", title: "Spring — Promo Musim Semi", client: "Kopi Senja", category: "Promo", views: 7600, uploaded: "2026-07-11", duration: "07:44", preview: 30,
    tools: ["After Effects", "CapCut"],
    desc: { id: "Video promo produk dengan motion graphic penuh warna.", en: "Product promo with colorful motion graphics." } },
  { yt: "Y-rmzh0PI3c", type: "own", title: "Cosmos Laundromat — Mini Doc", client: "", category: "Dokumenter", views: 21900, uploaded: "2026-05-30", duration: "12:10", preview: 100,
    tools: ["After Effects", "Topaz Video AI"],
    desc: { id: "Dokumenter pendek, fokus ke cerita dan pacing.", en: "Short documentary focused on story and pacing." } },
  { yt: "eRsGyueVLvQ", type: "client", title: "Aria & Dimas — Wedding Highlight", client: "Aria & Dimas", category: "Wedding", views: 3400, uploaded: "2026-02-21", duration: "14:48", preview: 120,
    tools: ["CapCut", "Topaz Video AI"],
    desc: { id: "Highlight pernikahan yang emosional, siap dibagikan ke keluarga.", en: "An emotional wedding highlight, ready to share with family." } },
  { yt: "aqz-KE-bpKQ", type: "client", title: "Annual Gathering 2025", client: "Northwind", category: "Event", views: 5100, uploaded: "2025-11-03", duration: "09:56", preview: 200,
    tools: ["CapCut"],
    desc: { id: "Dokumentasi acara tahunan perusahaan dengan highlight reel.", en: "Annual company event coverage with a highlight reel." } },
];

/* =========================================================
   STORE (aset digital) — pembayaran & pengiriman file lewat Avora
   Kartu menampilkan: thumbnail, title, header, harga, tombol See Item.
   Klik kartu = popup detail: thumbnail geser, title, header, deskripsi lengkap, harga, tombol Buy.

   name    : judul produk
   header  : kalimat pendek di bawah judul
   price   : harga (teks bebas)
   images  : daftar gambar thumbnail (bisa digeser di popup), mis. ["assets/store/preset-1.webp", "assets/store/preset-2.webp"]
             gambar pertama jadi thumbnail kartu. Kosong = gambar otomatis
   desc    : deskripsi lengkap, boleh beberapa baris (pisahkan dengan \n)
   url     : link produk di Avora (tombol Buy)
   tag     : label kategori (otomatis jadi filter)
   discover: (opsional) true atau angka urutan = ikut tampil di blok Discover
   ========================================================= */
window.PRODUCTS = [
  /* [CONTOH] ganti semuanya. Gambar contoh ada di assets/store/ */
  { name: { id: "Preset Color Grading Vol.1", en: "Color Grading Presets Vol.1" }, tag: "Preset", price: "Rp 49rb",
    header: { id: "30 preset warna sinematik", en: "30 cinematic color presets" },
    images: ["assets/store/sample-1.svg", "assets/store/sample-2.svg", "assets/store/sample-3.svg"],
    desc: { id: "30 preset warna sinematik untuk Premiere Pro dan CapCut.\nSekali klik, footage langsung punya look film.\n\nIsi paket:\n• 30 file preset\n• Panduan pemakaian\n• Update gratis", en: "30 cinematic color presets for Premiere Pro and CapCut.\nOne click gives your footage a film look.\n\nWhat is inside:\n• 30 preset files\n• Usage guide\n• Free updates" },
    url: "https://avora.id" },
  { name: { id: "Paket Transisi Smooth", en: "Smooth Transition Pack" }, tag: "Transisi", price: "Rp 79rb",
    header: { id: "50 transisi siap pakai", en: "50 ready-to-use transitions" },
    images: ["assets/store/sample-2.svg", "assets/store/sample-3.svg"],
    desc: { id: "50 transisi siap pakai, tinggal drag & drop ke timeline.\nKompatibel dengan After Effects dan CapCut.", en: "50 ready-to-use transitions, just drag & drop onto your timeline.\nCompatible with After Effects and CapCut." },
    url: "https://avora.id" },
  { name: { id: "Sound Effect Pack", en: "Sound Effect Pack" }, tag: "SFX", price: "Rp 59rb",
    header: { id: "200+ SFX bebas royalti", en: "200+ royalty-free SFX" },
    images: [],
    desc: { id: "200+ sound effect bebas royalti untuk konten kamu.", en: "200+ royalty-free sound effects for your content." },
    url: "https://avora.id" },
  { name: { id: "Template Roblox UI", en: "Roblox UI Template" }, tag: "Roblox", price: "Rp 99rb",
    header: { id: "Kit UI siap pakai", en: "Ready-to-use UI kit" },
    images: [],
    desc: { id: "Kit UI siap pakai untuk game Roblox, lengkap dengan tombol, panel, dan ikon.", en: "Ready-to-use UI kit for Roblox games with buttons, panels and icons." },
    url: "https://avora.id" },
];

/* =========================================================
   SCRIPT & TOOLS (blok Other) — klik kartu = popup detail seperti produk
   Isi: gambar yang bisa digeser, deskripsi, loader (tombol salin), game yang didukung, fitur, panduan, catatan.

   name, header, desc : teks dua bahasa
   status   : badge kecil, mis. { id: "Berfungsi", en: "Working" }
   images   : daftar gambar (yang pertama jadi thumbnail)
   loader   : script yang disalin pengunjung
   games    : [{ label: "Evade" }, { label: { id: "...", en: "..." }, soon: true }]  (soon = abu-abu)
   features : [{ t: "Judul", s: "Keterangan" }]
   steps    : daftar langkah cara pakai
   guide    : [{ q: "Judul", a: "Isi" }] untuk panel lipat (executor, troubleshooting, dll)
   note     : catatan / peringatan di bagian bawah
   discover : true atau angka urutan = ikut tampil di blok Discover
   ========================================================= */
window.SCRIPTS = [
  { id: "mugiwara-hub", name: "Mugiwara HUB", tag: "Script", discover: 1,
    status: { id: "Berfungsi", en: "Working" },
    header: { id: "Script hub Roblox modern dengan modul untuk tiap game", en: "A modern Roblox script hub with per-game modules" },
    desc: {
      id: "Script hub Roblox yang rapi dan modular, dengan fitur global dan modul khusus untuk tiap game yang didukung. Ringan, mudah dipakai, dan rutin diperbarui.",
      en: "A clean, modular Roblox script hub with global features and dedicated modules for each supported game. Lightweight, easy to use, and updated regularly.",
    },
    images: ["assets/other/mugiwara-hub.webp"],
    loader: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/honamichanhere/Mugiwara-HUB/refs/heads/main/Main.lua"))()',
    games: [
      { label: { id: "Universal", en: "Universal" } },
      { label: "Evade" },
      { label: { id: "Game lain segera hadir", en: "More coming soon" }, soon: true },
    ],
    features: [
      { t: "Global Tab", s: { id: "Jalan di semua game", en: "Works in every game" } },
      { t: "Game Modules", s: { id: "Fitur khusus tiap game", en: "Per-game features" } },
      { t: "Clean UI", s: { id: "Simpel dan responsif", en: "Simple & responsive" } },
      { t: "Key System", s: { id: "Akses premium", en: "Premium access" } },
    ],
    steps: [
      { id: "Buka executor kamu (Xeno, Delta, atau executor lain yang didukung).", en: "Open your executor (Xeno, Delta, or any supported executor)." },
      { id: "Salin loader script di atas.", en: "Copy the loader script above." },
      { id: "Masuk ke salah satu game yang didukung di Roblox.", en: "Join one of the supported games on Roblox." },
      { id: "Tempel script ke executor lalu tekan Execute.", en: "Paste the script into the executor and press Execute." },
      { id: "Ambil key, masukkan, dan nikmati hub-nya.", en: "Get your key, enter it, and enjoy the hub." },
    ],
    guide: [
      { q: { id: "Executor yang didukung", en: "Supported executors" },
        a: { id: "Dites di Xeno (PC) dan Delta (Mobile). Kebanyakan executor yang mendukung loadstring dan HttpGet seharusnya bisa.", en: "Tested on Xeno (PC) and Delta (Mobile). Most executors with loadstring and HttpGet support should work." } },
      { q: { id: "Script tidak jalan?", en: "Script not working?" },
        a: { id: "Pastikan script tersalin utuh, executor sudah versi terbaru, dan kamu ada di game yang didukung. Kalau masih gagal, laporkan di komunitas.", en: "Make sure you copied the full script, your executor is up to date, and you are in a supported game. If it still fails, report it in the community." } },
    ],
    note: {
      id: "Pakai dengan risiko sendiri. Script pihak ketiga bisa melanggar Ketentuan Layanan Roblox dan berisiko membuat akun terkena tindakan.",
      en: "Use scripts at your own risk. Using third-party scripts may violate Roblox Terms of Service and can result in account action.",
    },
  },
];

/* =========================================================
   GAME ROBLOX (blok Other)
   url      : link game
   placeId  : (opsional) angka di link roblox.com/games/ANGKA/...  → gambar, jumlah pemain & visit
              diambil OTOMATIS oleh GitHub Action
   image    : (opsional) gambar manual kalau tidak pakai placeId
   discover : (opsional) true atau angka urutan = ikut tampil di blok Discover
   ========================================================= */
window.GAMES = [
  /* [CONTOH] game orang lain cuma buat contoh tampilan live stats. Ganti dengan game lu. */
  { name: "Adopt Me! (contoh)", placeId: 920587237, url: "https://www.roblox.com/games/920587237",
    desc: { id: "Contoh kartu game dengan statistik otomatis.", en: "Sample game card with automatic stats." } },
  { name: { id: "Game Kamu #2", en: "Your Game #2" }, url: "", image: "",
    desc: { id: "Deskripsi singkat game. Isi url supaya tombol Main aktif.", en: "Short game description. Set url to enable the Play button." } },
];

/* Link lain di blok Other (komunitas, donasi, dll). icon: sama seperti LINKS. url kosong = disembunyikan */
window.OTHER_LINKS = [
  { label: "Discord Community", desc: { id: "Ngobrol, bagi tips edit & dev", en: "Chat, share editing & dev tips" }, icon: "discord", url: "" },    // [CONTOH]
  { label: "Trakteer",          desc: { id: "Dukung karya gua", en: "Support my work" },                              icon: "link",    url: "" },    // [CONTOH]
];

/* [CONTOH] Paket harga jasa edit (tampil ringkas di bawah tab Client). popular: true = highlight */
window.PRICING = [
  { name: { id: "Short", en: "Short" }, price: "Rp 150rb", unit: { id: "/ video", en: "/ video" },
    desc: { id: "Reels, TikTok, Shorts.", en: "Reels, TikTok, Shorts." },
    features: [
      { id: "Sampai 60 detik", en: "Up to 60 seconds" },
      { id: "Caption & efek dasar", en: "Captions & basic effects" },
      { id: "2x revisi", en: "2 revisions" },
      { id: "Selesai 2 hari", en: "2-day delivery" },
    ] },
  { name: { id: "Pro", en: "Pro" }, price: "Rp 500rb", unit: { id: "/ video", en: "/ video" }, popular: true,
    desc: { id: "Promosi & YouTube.", en: "Promo & YouTube." },
    features: [
      { id: "Sampai 5 menit", en: "Up to 5 minutes" },
      { id: "Color grading & sound design", en: "Color grading & sound design" },
      { id: "Motion graphic", en: "Motion graphics" },
      { id: "3x revisi", en: "3 revisions" },
    ] },
  { name: { id: "Cinematic", en: "Cinematic" }, price: "Rp 1,5jt", unit: { id: "mulai dari", en: "from" },
    desc: { id: "Wedding & brand film.", en: "Weddings & brand films." },
    features: [
      { id: "Durasi bebas", en: "Any duration" },
      { id: "Grading sinematik + VFX", en: "Cinematic grading + VFX" },
      { id: "Revisi sampai puas", en: "Revisions until happy" },
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
