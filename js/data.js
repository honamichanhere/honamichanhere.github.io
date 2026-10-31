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
    { n: 100, suffix: "+", label: { id: "Client", en: "Clients" } },
    { n: 3, suffix: "+", label: { id: "Tahun pengalaman", en: "Years of experience" } },
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
  { yt: "https://www.youtube.com/watch?v=64MjgGJADjA", type: "other", category: "Tutorial", discover: 7 },

  /* Video client. Judul, tayang, tanggal, durasi diisi otomatis dari YouTube; urutan = tanggal upload (terbaru di atas).
     featured: 1..10 = 10 video yang tampil paling depan (angka kecil = lebih dulu) */
  { yt: "_FLhz5F5nHM", type: "client", category: "Bucin" },
  { yt: "PebraaFaMxY", type: "client", category: "Velocity" },
  { yt: "vzqBjpwi_o0", type: "client", category: "Hardcore" },
  { yt: "_wANIRjH-8c", type: "client", category: "Gameplay" },
  { yt: "sFfg_e9lZEA", type: "client", category: "Velocity" },
  { yt: "uAOnYcljTik", type: "client", category: "Hardcore" },
  { yt: "TO4pvrBBldA", type: "client", category: "Velocity" },
  { yt: "xzbZSjcRqSM", type: "client", category: "Gameplay" },
  { yt: "bnl8dDHZQFU", type: "client", category: "Bucin" },
  { yt: "D5ecgpjFKvY", type: "client", category: "Gameplay" },
  { yt: "ru0DpZ8QQKY", type: "client", category: "Gameplay" },
  { yt: "bZr-X9YeUrY", type: "client", category: "Sad Vibe" },
  { yt: "QHXKStcIYW0", type: "client", category: "Sad Vibe" },
  { yt: "uyl1CFj-vqg", type: "client", category: "Sad Vibe" },
  { yt: "Jbsvi_HGwUY", type: "client", category: "Velocity" },
  { yt: "Fy3gxGnnjso", type: "client", category: "Hardcore" },
  { yt: "THL6OoZeHQw", type: "client", category: "Gameplay" },
  { yt: "t7BMe0vBfuM", type: "client", category: "Velocity" },
  { yt: "aIdJJQjB7yQ", type: "client", category: "Bucin" },
  { yt: "ueoe9M2iNMk", type: "client", category: "Velocity" },
  { yt: "6gEQGzXlozU", type: "client", category: "Velocity" },
  { yt: "B_jrXQk_wO4", type: "client", category: "Gameplay" },
  { yt: "c58hcxz5iE0", type: "client", category: "Gameplay" },
  { yt: "npX3M3QahbQ", type: "client", category: "Velocity" },
  { yt: "ml0yjHOFXzg", type: "client", category: "Gameplay" },
  { yt: "gdB3kSca6I4", type: "client", category: "Gameplay" },
  { yt: "McXdIWfvG3g", type: "client", category: "Velocity" },
  { yt: "wh59N4bnFXc", type: "client", category: "Gameplay" },
  { yt: "pSrPbe0Vz5o", type: "client", category: "Velocity" },
  { yt: "GYHDWAm6swA", type: "client", category: "Gameplay" },
  { yt: "f65JkTeyKyQ", type: "client", category: "Velocity" },
  { yt: "F4D4GtwRSXk", type: "client", category: "Sad Vibe" },
  { yt: "-fdllgFPUro", type: "client", category: "Sad Vibe" },
  { yt: "jAa0V1wQJow", type: "client", category: "Sad Vibe" },
  { yt: "LhuZFR5LiwI", type: "client", category: "Sad Vibe" },
  { yt: "KTuXD6RALO4", type: "client", category: "Gameplay" },
  { yt: "wYOlgsBFdWQ", type: "client", category: "Velocity" },
  { yt: "fqf6Jvff5cY", type: "client", category: "Gameplay" },
  { yt: "X4VYv0oRIuU", type: "client", category: "Velocity" },
  { yt: "a74xuDwnlIY", type: "client", category: "Velocity" },
  { yt: "JmkZxlkK-wQ", type: "client", category: "Gameplay" },
  { yt: "An8-_PB_cQU", type: "client", category: "Gameplay" },
  { yt: "rR7jpIGru8w", type: "client", category: "Sad Vibe" },
  { yt: "ec2JZ__Ngtg", type: "client", category: "Gameplay" },
  { yt: "wD_9PiNpZGw", type: "client", category: "Velocity" },
  { yt: "XDjXUfSaJcA", type: "client", category: "Gameplay" },
  { yt: "baUdHGPstxQ", type: "client", category: "Bucin" },
  { yt: "aNMUtmBWDlk", type: "client", category: "Sad Vibe" },
  { yt: "HYgbvAyatbQ", type: "client", category: "Bucin" },
  { yt: "II5eThLbIKg", type: "client", category: "Gameplay" },
  { yt: "I51pngCJBII", type: "client", category: "Velocity" },
  { yt: "hRjEU2LCqJ8", type: "client", category: "Hardcore" },
  { yt: "9KxCPF4Mzrw", type: "client", category: "Gameplay" },
  { yt: "9SVMPfQmM78", type: "client", category: "Hardcore" },
  { yt: "WsuCCemvumw", type: "client", category: "Velocity", featured: 5 },
  { yt: "NbxDG4wFAo4", type: "client", category: "Velocity", featured: 8 },
  { yt: "65DWut3efjw", type: "client", category: "Cinematic", featured: 9 },
  { yt: "Zdt2WaXDJKs", type: "client", category: "Velocity", featured: 7 },
  { yt: "fbA8AhtvXFk", type: "client", category: "Cinematic", featured: 10 },
  { yt: "4reTZ0iLyWE", type: "client", category: "Drama", featured: 1 },
  { yt: "FdBofsIwSUs", type: "client", category: "Velocity", featured: 3 },
  { yt: "lowRlDkjpiI", type: "client", category: "Hardcore", featured: 4 },
  { yt: "pv-fcl0Y7Fc", type: "client", category: "Velocity", featured: 6 },
  { yt: "ZMpLUxoK9_Q", type: "client", category: "Velocity" },
  { yt: "yW6frfpTODM", type: "client", category: "Drama", featured: 2 },
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
  { id: "korless-visual", discover: 2, name: { id: "Korless Visual - Roblox Script", en: "Korless Visual - Roblox Script" }, tag: "Roblox", price: "Rp 10.000",
    header: { id: "Efek visual Korless untuk Mobile/Desktop", en: "Korless visual effect for Mobile/Desktop" },
    images: ["assets/store/korless-visual.webp", "assets/store/korless-visual-2.webp", "assets/store/korless-visual-3.webp"],
    desc: {
      id: "Korless Visual untuk Mobile/Desktop\n• Mendukung Evade\n• Mendukung game lain\n• Mendukung R6/R15\n• Risiko rendah\n\nPENTING! Baca sebelum membeli. Script ini hanya untuk efek visual: efek Korless hanya terlihat di layar kamu sendiri. Perlu dipahami bahwa metode ini punya risiko karena memakai exploit, dan pembeli menanggung penuh semua risikonya. Aku hanya menjual script ini bagi yang berminat.",
      en: "Korless Visual for Mobile/Desktop\n• Evade support\n• Other games support\n• R6/R15 support\n• Low risk\n\nIMPORTANT! Read before purchase. This script is for visual purposes only: the Korless effect is visible only on your screen. Please be aware that this method carries risks, as it relies on an exploit, and the buyer assumes full responsibility. I am simply selling the script to those interested.",
    },
    sold: 337,
    url: "https://avora.id/honamihere/korless-visual-roblox-script" },

  { id: "evade-visual-emotes", discover: 3, name: { id: "Evade Visual Emotes - Roblox Script", en: "Evade Visual Emotes - Roblox Script" }, tag: "Roblox", price: "Rp 20.000",
    header: { id: "Ganti emote secara instan di Evade (Mobile/Desktop)", en: "Swap emotes instantly in Evade (Mobile/Desktop)" },
    images: ["assets/store/evade-visual-emotes.webp"],
    desc: {
      id: "Evade Visual Emotes untuk Mobile/Desktop\n• Khusus Evade\n• Ganti emote secara instan\n• Semua emote bisa ditukar\n• Rockin Stride hanya bisa ditukar ke Kickback\n• Zombie Stride hanya bisa ditukar ke Classic Dance\n\nBACA SEBELUM MEMBELI! Skrip ini hanya untuk tujuan visual: emote hanya terlihat di layar kamu. Perlu dipahami bahwa metode ini berisiko tinggi jika dipakai bersamaan dengan siaran langsung karena bergantung pada exploit, dan pembeli menanggung sepenuhnya segala risikonya. Aku hanya menjual skrip ini kepada pihak yang berminat dan memahami risikonya.",
      en: "Evade Visual Emotes for Mobile/Desktop\n• Evade only\n• Swap emotes instantly\n• All emotes can be swapped\n• Rockin Stride can only swap to Kickback\n• Zombie Stride can only swap to Classic Dance\n\nREAD BEFORE BUYING! This script is visual-only: the emote effects only show up on your screen. Using it while livestreaming can be pretty risky, since it relies on an exploit, and you are fully responsible for anything that happens to your account. I am only selling the script to people who are interested and understand the risks.",
    },
    sold: 66,
    url: "https://avora.id/honamihere/evade-visual-emotes-roblox-script" },

  { id: "evade-visual-unusual", discover: 4, name: { id: "Evade Visual Unusual - Roblox Script", en: "Evade Visual Unusual - Roblox Script" }, tag: "Roblox", price: "Rp 20.000",
    header: { id: "Ganti Unusual secara instan di Evade (Mobile/Desktop)", en: "Swap Unusual instantly in Evade (Mobile/Desktop)" },
    images: ["assets/store/evade-visual-unusual.webp"],
    desc: {
      id: "Evade Visual Unusual untuk Mobile/Desktop\n• Khusus Evade\n• Ganti Unusual secara instan\n• Semua Unusual bisa ditukar\n\nBACA SEBELUM MEMBELI! Skrip ini hanya untuk tujuan visual: Unusual hanya terlihat di layar kamu. Perlu dipahami bahwa metode ini berisiko tinggi jika dipakai bersamaan dengan siaran langsung karena bergantung pada exploit, dan pembeli menanggung sepenuhnya segala risikonya. Aku hanya menjual skrip ini kepada pihak yang berminat.",
      en: "Evade Visual Unusual for Mobile/Desktop\n• Evade only\n• Swap Unusual instantly\n• All Unusual can be swapped\n\nREAD BEFORE BUYING! This script is visual-only: the unusual effects will only show up on your screen. Using it while livestreaming can be pretty risky, since it relies on an exploit. Use it at your own risk, you are fully responsible for anything that happens to your account. I am only selling the script to people who are interested and understand the risks.",
    },
    url: "https://avora.id/honamihere/evade-visual-unusual-roblox-script" },

  { id: "evade-visual-carry", discover: 5, name: { id: "Evade Visual Carry - Roblox Script", en: "Evade Visual Carry - Roblox Script" }, tag: "Roblox", price: "Rp 10.000",
    header: { id: "Ganti Carry secara instan di Evade (Mobile/Desktop)", en: "Swap Carry instantly in Evade (Mobile/Desktop)" },
    images: ["assets/store/evade-visual-carry.webp"],
    desc: {
      id: "Evade Visual Carry untuk Mobile/Desktop\n• Khusus Evade\n• Ganti Carry secara instan\n• Semua Carry bisa ditukar\n\nBACA SEBELUM MEMBELI! Skrip ini hanya untuk tujuan visual: efek Carry hanya terlihat di layar kamu. Perlu dipahami bahwa metode ini berisiko tinggi jika dipakai bersamaan dengan siaran langsung karena bergantung pada exploit, dan pembeli menanggung sepenuhnya segala risikonya. Aku hanya menjual skrip ini kepada pihak yang berminat.",
      en: "Evade Visual Carry for Mobile/Desktop\n• Evade only\n• Swap Carry instantly\n• All Carry can be swapped\n\nREAD BEFORE BUYING! This script is visual-only: the carry effects will only show up on your screen. Using it while livestreaming can be pretty risky, since it relies on an exploit. Use it at your own risk, you are fully responsible for anything that happens to your account. I am only selling the script to people who are interested and understand the risks.",
    },
    url: "https://avora.id/honamihere/evade-visual-carry-roblox-script" },

  { id: "evade-visual-catalog", discover: 6, name: { id: "Evade Visual Catalog - Roblox Script", en: "Evade Visual Catalog - Roblox Script" }, tag: "Roblox", price: "Rp 30.000",
    header: { id: "Pakai item catalog secara visual di Evade (Mobile/Desktop)", en: "Use catalog items visually in Evade (Mobile/Desktop)" },
    images: ["assets/store/evade-visual-catalog.webp"],
    desc: {
      id: "Evade Visual Catalog untuk Mobile/Desktop\n• Semua Accessories\n• Semua Clothing\n• Semua Head\n• Semua Shirt\n\nBACA SEBELUM MEMBELI! Skrip ini hanya untuk tujuan visual: semua item catalog hanya terlihat di layar kamu. Perlu dipahami bahwa metode ini berisiko tinggi jika dipakai bersamaan dengan siaran langsung karena bergantung pada exploit, dan pembeli menanggung sepenuhnya segala risikonya. Aku hanya menjual skrip ini kepada pihak yang berminat.",
      en: "Evade Visual Catalog for Mobile/Desktop\n• All Accessories\n• All Clothing\n• All Head\n• All Shirt\n\nREAD BEFORE BUYING! This script is visual-only: everything from the catalog will only show up on your screen. Using it while livestreaming can be pretty risky, since it relies on an exploit. Use it at your own risk, you are fully responsible for anything that happens to your account. I am only selling the script to people who are interested and understand the risks.",
    },
    url: "https://avora.id/honamihere/evade-visual-catalog-roblox-script" },

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
    loader: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/honamichanhere/MugiwaraHub/refs/heads/main/Main.lua"))()',
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
      order: { text: { id: "Untuk beli, hubungi lewat Discord", en: "To buy, contact me on Discord" }, label: "Discord EVACORE", url: "https://discord.gg/djmrevtSV7" },
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

/* Harga jasa edit (tampil di tab Client → Harga). Dibagi per kelompok; tiap kelompok punya beberapa paket.
   name/desc : nama & keterangan kelompok
   plans     : price, unit, features (daftar), popular: true = highlight, name (opsional, default "Paket 1, 2, ...") */
window.PRICING = [
  { name: { id: "Regular", en: "Regular" }, desc: { id: "Reels, TikTok, Shorts, dll.", en: "Reels, TikTok, Shorts, etc." },
    plans: [
      { price: "Rp 50rb", unit: { id: "/ video", en: "/ video" }, features: [
        { id: "Maksimal 30 detik", en: "Up to 30 seconds" },
        { id: "Caption / Lirik", en: "Caption / Lyrics" },
        { id: "Tanpa revisi", en: "No revision" } ] },
      { price: "Rp 100rb", unit: { id: "/ video", en: "/ video" }, features: [
        { id: "Maksimal 60 detik", en: "Up to 60 seconds" },
        { id: "Caption / Lirik / Efek dasar", en: "Caption / Lyrics / Basic effects" },
        { id: "Tanpa revisi", en: "No revision" } ] },
      { price: "Rp 150rb", unit: { id: "/ video", en: "/ video" }, features: [
        { id: "Maksimal 60 detik", en: "Up to 60 seconds" },
        { id: "Caption / Lirik / Efek / Shake", en: "Caption / Lyrics / Effects / Shake" },
        { id: "1x revisi", en: "1 revision" } ] },
    ] },
  /* [CONTOH] kelompok di bawah ini masih contoh, ganti sesuai paket aslimu */
  { name: { id: "Pro", en: "Pro" }, desc: { id: "Promosi & YouTube.", en: "Promo & YouTube." },
    plans: [
      { price: "Rp 500rb", unit: { id: "/ video", en: "/ video" }, features: [
        { id: "Sampai 5 menit", en: "Up to 5 minutes" },
        { id: "Color grading & sound design", en: "Color grading & sound design" },
        { id: "Motion graphic", en: "Motion graphics" },
        { id: "3x revisi", en: "3 revisions" } ] },
    ] },
  { name: { id: "Cinematic", en: "Cinematic" }, desc: { id: "Wedding & brand film.", en: "Weddings & brand films." },
    plans: [
      { price: "Rp 1,5jt", unit: { id: "mulai dari", en: "from" }, features: [
        { id: "Durasi bebas", en: "Any duration" },
        { id: "Grading sinematik + VFX", en: "Cinematic grading + VFX" },
        { id: "Revisi sampai puas", en: "Revisions until happy" },
        { id: "Prioritas pengerjaan", en: "Priority turnaround" } ] },
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
