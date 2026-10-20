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
  { label: "Discord",   sub: "EVACORE",                                      icon: "discord", url: "https://discord.gg/djmrevtSV7" },
  { label: "Roblox",    sub: "@honamichandesu",                              icon: "roblox",  url: "https://www.roblox.com/users/8485135229/profile" },
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
   ratio     : (opsional) rasio video, mis. "9:16", "1:1", "3:4", "4:3", "16:9". Kosong = TERDETEKSI OTOMATIS dari YouTube
               (Shorts/Reels vertikal dikenali sendiri). Isi hanya kalau deteksi otomatisnya keliru
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
   images  : daftar gambar thumbnail (bisa digeser di popup), mis. ["assets/store/produk-1.webp", "assets/store/produk-2.webp"]
             gambar pertama jadi thumbnail kartu. Kosong = gambar otomatis
   desc    : deskripsi lengkap, boleh beberapa baris (pisahkan dengan \n)
   url     : link produk di Avora (tombol Buy). Jumlah terjual dibaca OTOMATIS dari halaman ini tiap jam
   sold    : (opsional) jumlah terjual manual, dipakai sebagai cadangan kalau pembacaan otomatis gagal
   Untuk produk dengan link Avora, JUDUL, HARGA, HARGA CORET (diskon), dan JUMLAH TERJUAL otomatis mengikuti halaman Avora (tiap jam).
   name / price / sold di sini cuma cadangan. Tambah  mirror: false  di produk kalau mau memakai nilai di sini saja.
   tag     : label kategori (otomatis jadi filter)
   discover: (opsional) true atau angka urutan = ikut tampil di blok Discover
   ========================================================= */
window.PRODUCTS = [
  /* Produk asli */
  { id: "korless-visual", name: { id: "Korless Visual - Roblox Script", en: "Korless Visual - Roblox Script" }, tag: "Roblox", price: "Rp 10.000",
    header: { id: "Efek visual Korless untuk Mobile/Desktop", en: "Korless visual effect for Mobile/Desktop" },
    images: ["assets/store/korless-visual.webp"],
    desc: {
      id: "Korless Visual untuk Mobile/Desktop\n• Mendukung Evade\n• Mendukung game lain\n• Mendukung R6/R15\n• Risiko rendah\n\nPENTING! Baca sebelum membeli. Script ini hanya untuk efek visual: efek Korless hanya terlihat di layar kamu sendiri. Perlu dipahami bahwa metode ini punya risiko karena memakai exploit, dan pembeli menanggung penuh semua risikonya. Aku hanya menjual script ini bagi yang berminat.",
      en: "Korless Visual for Mobile/Desktop\n• Evade support\n• Other games support\n• R6/R15 support\n• Low risk\n\nIMPORTANT! Read before purchase. This script is for visual purposes only: the Korless effect is visible only on your screen. Please be aware that this method carries risks, as it relies on an exploit, and the buyer assumes full responsibility. I am simply selling the script to those interested.",
    },
    sold: 337,
    url: "https://avora.id/honamihere/korless-visual-roblox-script" },

  { id: "evade-visual-emotes", name: { id: "Evade Visual Emotes - Roblox Script", en: "Evade Visual Emotes - Roblox Script" }, tag: "Roblox", price: "Rp 20.000",
    header: { id: "Ganti emote secara instan di Evade (Mobile/Desktop)", en: "Swap emotes instantly in Evade (Mobile/Desktop)" },
    images: ["assets/store/evade-visual-emotes.webp"],
    desc: {
      id: "Evade Visual Emotes untuk Mobile/Desktop\n• Khusus Evade\n• Ganti emote secara instan\n• Semua emote bisa ditukar\n• Rockin Stride hanya bisa ditukar ke Kickback\n• Zombie Stride hanya bisa ditukar ke Classic Dance\n\nBACA SEBELUM MEMBELI! Skrip ini hanya untuk tujuan visual: emote hanya terlihat di layar kamu. Perlu dipahami bahwa metode ini berisiko tinggi jika dipakai bersamaan dengan siaran langsung karena bergantung pada exploit, dan pembeli menanggung sepenuhnya segala risikonya. Aku hanya menjual skrip ini kepada pihak yang berminat dan memahami risikonya.",
      en: "Evade Visual Emotes for Mobile/Desktop\n• Evade only\n• Swap emotes instantly\n• All emotes can be swapped\n• Rockin Stride can only swap to Kickback\n• Zombie Stride can only swap to Classic Dance\n\nREAD BEFORE BUYING! This script is visual-only: the emote effects only show up on your screen. Using it while livestreaming can be pretty risky, since it relies on an exploit, and you are fully responsible for anything that happens to your account. I am only selling the script to people who are interested and understand the risks.",
    },
    sold: 66,
    url: "https://avora.id/honamihere/evade-visual-emotes-roblox-script" },

  { id: "cc-quality-pack", name: { id: "My CC+Quality Pack - After Effect", en: "My CC+Quality Pack - After Effect" }, tag: "Editing", price: "Rp 50.000",
    header: { id: "Setup CC dan kualitas After Effects yang aku pakai sendiri", en: "The exact CC & quality setup I use in After Effects" },
    images: ["assets/store/cc-quality-pack.webp"],
    desc: {
      id: "Setup CC dan kualitas yang aku pakai sendiri untuk kontenku.\n\nDibuat supaya footage terlihat lebih bersih, tajam, dan rapi tanpa menghabiskan berjam-jam mengatur semuanya dari nol.\n\nIsi paket:\n• Color correction / color grading\n• Peningkatan kualitas\n• Penajaman dan detail\n• Preset After Effects siap pakai\n• Setup workflow pribadiku\n\nCATATAN PLUGIN! Beberapa efek di paket ini memakai plugin After Effects pihak ketiga.\nPlugin yang dibutuhkan:\n• Boris FX - Sapphire\n• Boris FX - BCC Looks\n\nPembelian sekali bayar. Produk digital, tidak ada barang fisik yang dikirim.",
      en: "The exact CC & quality setup I personally use for my content.\n\nBuilt to give your footage a cleaner, sharper and more polished look without spending hours tweaking everything from scratch.\n\nWhat's included:\n• Color Correction / Color Grading\n• Quality enhancement\n• Sharpening & detail enhancement\n• Ready-to-use After Effects presets\n• My personal workflow setup\n\nPLUGIN NOTICE! Some effects in this pack use third-party After Effects plugins.\nPlugins needed:\n• Boris FX - Sapphire\n• Boris FX - BCC Looks\n\nOne-time purchase. Digital product. No physical item will be shipped.",
    },
    sold: 6,
    url: "https://avora.id/honamihere/my-ccquality-pack-after-effect" },
];

/* =========================================================
   SCRIPT & TOOLS (blok Other) — klik kartu = popup detail seperti produk
   Isi: gambar yang bisa digeser, deskripsi, loader (tombol salin), game yang didukung, fitur, panduan, catatan.

   name, header, desc : teks dua bahasa
   status   : badge kecil, mis. { id: "Berfungsi", en: "Working" }
   images   : daftar gambar (yang pertama jadi thumbnail)
   loader   : script yang disalin pengunjung
   games    : [{ label: "Evade" }, { label: { id: "...", en: "..." }, soon: true }]  (soon = abu-abu)
   features : [{ t: "Judul", s: "Keterangan", wide: true }]  (wide: true = kartu selebar penuh)
   pricing  : { note, plans: [{ label, price, best: true }], order: { text, label, url } }  daftar harga langganan + cara order (opsional)
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
      { t: "Shaders", s: { id: "Grafis lebih bagus di game apa pun", en: "Better graphics for any game" } },
      { t: "Visual & Avatar", s: "Visual Korless, Visual Accessories, Avatar Changer" },
      { t: "Camera", s: "FreeCam, FOV, Zoom, Stabilizer" },
      { t: "Per-Game Modules", s: { id: "Fitur khusus untuk tiap game", en: "Dedicated features for each game" } },
      { t: "Movement", s: "Speed Hack, Fly, No Clip, Animation Speed", wide: true },
    ],
    pricing: {
      note: { id: "Mugiwara HUB gratis dipakai dengan sistem key. Mau fitur lengkap? Berlangganan Premium.", en: "Mugiwara HUB is free to use with a key system. Want the full feature set? Subscribe to Premium." },
      plans: [
        { label: { id: "7 Hari", en: "7 Days" }, price: "Rp 10.000" },
        { label: { id: "30 Hari", en: "30 Days" }, price: "Rp 30.000" },
        { label: "Lifetime", price: "Rp 100.000", best: true },
      ],
      order: { text: { id: "Untuk order, DM di TikTok", en: "To order, DM me on TikTok" }, label: "@honamichanhere", url: "https://www.tiktok.com/@honamichanhere" },
    },
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
   placeId  : angka di link roblox.com/games/ANGKA/...  → NAMA, deskripsi, gambar, jumlah pemain & visit
              diambil OTOMATIS dari Roblox oleh GitHub Action (tiap jam)
   name/desc: (opsional) isi kalau mau memakai teks sendiri, mis. name: "Lost Island", desc: { id: "...", en: "..." }
   image    : (opsional) gambar manual kalau tidak pakai placeId
   discover : (opsional) true atau angka urutan = ikut tampil di blok Discover
   ========================================================= */
window.GAMES = [
  { placeId: 105281863496499, url: "https://www.roblox.com/games/105281863496499/Lost-Island" },
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
