// Ambil data otomatis lalu simpan ke js/stats.json:
//  - YouTube Data API : tayang, judul, tanggal upload, durasi (butuh env YT_API_KEY, kalau kosong dilewati)
//  - Avora (halaman publik): jumlah terjual, judul, harga, dan harga coret per produk (karena Avora belum punya API)
//  - Rasio asli video  : dari gambar oar2 YouTube (vertikal untuk Shorts/Reels)
//  - Roblox (publik)  : nama, jumlah pemain, total kunjungan, ikon, untuk game yang punya placeId
import fs from "node:fs";
import vm from "node:vm";

const win = {};
vm.runInNewContext(fs.readFileSync("js/data.js", "utf8"), { window: win });
const ytId = s => { s = String(s || "").trim(); const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m ? m[1] : s.slice(0, 11); };

const FILE = "js/stats.json";
let out = {};
try { out = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch {}
const before = JSON.stringify(out);
let failed = false;

/* ---------- YouTube ---------- */
const key = process.env.YT_API_KEY;
if (!key) console.log("YT_API_KEY belum diset — lewati YouTube.");
else {
  const ids = [...new Set([...(win.VIDEOS || []).map(v => ytId(v.yt))].filter(Boolean))];
  const dur = iso => {
    const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || ""); if (!m) return "";
    const [h, mi, s] = [m[1] || 0, m[2] || 0, m[3] || 0].map(Number), p = n => String(n).padStart(2, "0");
    return h ? `${h}:${p(mi)}:${p(s)}` : `${p(mi)}:${p(s)}`;
  };
  try {
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50);
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${chunk.join(",")}&key=${key}`);
      if (!res.ok) throw new Error(`YouTube API ${res.status}: ${await res.text()}`);
      for (const it of (await res.json()).items || []) {
        out[it.id] = { views: Number(it.statistics?.viewCount ?? 0), title: it.snippet?.title || "", uploaded: (it.snippet?.publishedAt || "").slice(0, 10), duration: dur(it.contentDetails?.duration), description: String(it.snippet?.description || "").replace(/\r/g, "").slice(0, 1500) };
      }
    }
    console.log(`YouTube: ${ids.length} video dicek.`);
  } catch (e) { console.error(String(e)); failed = true; }
}

/* ---------- Rasio asli video (dari gambar oar2 YouTube; hanya sekali per video) ---------- */
{
  const jpgSize = b => { if (b[0] !== 0xff || b[1] !== 0xd8) return null; let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const mk = b[i + 1]; if (mk >= 0xc0 && mk <= 0xcf && mk !== 0xc4 && mk !== 0xc8 && mk !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + b.readUInt16BE(i + 2); } return null; };
  const ratios = { ...(out._ratio || {}) };
  for (const id of new Set((win.VIDEOS || []).map(v => ytId(v.yt)).filter(Boolean))) {
    if (ratios[id]) continue;
    try {
      const res = await fetch(`https://i.ytimg.com/vi/${id}/oar2.jpg`, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) continue;
      const d = jpgSize(Buffer.from(await res.arrayBuffer())); if (d && d.w > 120) ratios[id] = d.w + ":" + d.h;
    } catch {}
  }
  if (Object.keys(ratios).length) out._ratio = ratios;
}

/* ---------- Roblox ---------- */
const places = [...new Set((win.GAMES || []).map(g => g.placeId).filter(Boolean))];
if (places.length) {
  const rb = {};
  try {
    const uni = {};
    for (const p of places) {
      const r = await fetch(`https://apis.roblox.com/universes/v1/places/${p}/universe`);
      if (r.ok) { const j = await r.json(); if (j.universeId) uni[p] = j.universeId; }
    }
    const uids = [...new Set(Object.values(uni))];
    if (uids.length) {
      const g = await (await fetch(`https://games.roblox.com/v1/games?universeIds=${uids.join(",")}`)).json();
      const th = await (await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${uids.join(",")}&returnPolicy=PlaceHolder&size=256x256&format=Png&isCircular=false`)).json();
      const gById = Object.fromEntries((g.data || []).map(x => [x.id, x]));
      const tById = Object.fromEntries((th.data || []).map(x => [x.targetId, x.imageUrl]));
      for (const [p, u] of Object.entries(uni)) {
        const x = gById[u]; if (!x) continue;
        rb[p] = { name: x.name, description: String(x.description || "").replace(/\r/g, "").trim().slice(0, 400), playing: x.playing ?? 0, visits: x.visits ?? 0, image: tById[u] || "" };
      }
    }
    if (Object.keys(rb).length) { out._roblox = rb; console.log(`Roblox: ${Object.keys(rb).length} game dicek.`); }
  } catch (e) { console.error("Roblox:", String(e)); failed = true; }
}

/* ---------- Avora: jumlah terjual dari halaman produk publik (Avora belum punya API) ---------- */
const avoraUrls = [...new Set((win.PRODUCTS || []).map(p => String(p.url || "").trim()).filter(u => /^https:\/\/avora\.id\/\S+$/.test(u)))];
if (avoraUrls.length) {
  const sold = { ...(out._sold || {}) }, meta = { ...(out._avora || {}) };
  const decode = s => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const num = s => Number(String(s).replace(/\D/g, ""));
  const rp = s => "Rp " + String(s).replace(/[.,]+$/, "");
  for (const u of avoraUrls) {
    try {
      const res = await fetch(u, { headers: { "user-agent": "HonamiLinkInBioStats/1.0 (+https://honamichanhere.github.io)", "accept-language": "id" }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const html = await res.text(), info = { ...(meta[u] || {}) };
      /* jumlah terjual */
      const mm = html.match(/(\d[\d.,]*)\s*orang\s+sudah\s+beli/i);
      if (mm) sold[u] = Number(mm[1].replace(/[.,]/g, "")); else console.warn("Avora: angka terjual tidak ditemukan di " + u + " (struktur halaman berubah?). Nilai lama dipakai.");
      /* judul produk */
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/), title = h1 ? decode(h1[1].replace(/<[^>]*>/g, "")).trim() : "";
      if (title) info.title = title; else console.warn("Avora: judul tidak ditemukan di " + u + ". Nilai lama dipakai.");
      /* harga sekarang (tombol Beli) dan harga coret (kalau ada diskon) */
      const now = html.match(/Beli\s*\u00b7\s*Rp\s?([\d.,]+)/), old = html.match(/<p[^>]*line-through[^>]*>\s*Rp\s?([\d.,]+)\s*<\/p>/);
      if (now) { info.price = rp(now[1]); info.oldPrice = old && num(old[1]) > num(now[1]) ? rp(old[1]) : ""; }
      else console.warn("Avora: harga tidak ditemukan di " + u + ". Nilai lama dipakai.");
      meta[u] = info;
    } catch (e) { console.warn("Avora: gagal membaca " + u + " — " + String(e)); }
    await new Promise(r => setTimeout(r, 1500));
  }
  if (Object.keys(sold).length) out._sold = sold;
  if (Object.keys(meta).length) out._avora = meta;
  console.log("Avora: " + avoraUrls.length + " produk dicek.");
}

const next = JSON.stringify(out, null, 2) + "\n";
if (JSON.stringify(out) !== before) { fs.writeFileSync(FILE, next); console.log("stats.json diperbarui."); }
else console.log("Tidak ada perubahan.");
if (failed) process.exitCode = 1;
