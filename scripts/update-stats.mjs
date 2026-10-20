// Ambil data otomatis lalu simpan ke js/stats.json:
//  - YouTube Data API : tayang, judul, tanggal upload, durasi (butuh env YT_API_KEY, kalau kosong dilewati)
//  - Avora (halaman publik): jumlah terjual per produk (karena Avora belum punya API)
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
        rb[p] = { name: x.name, playing: x.playing ?? 0, visits: x.visits ?? 0, image: tById[u] || "" };
      }
    }
    if (Object.keys(rb).length) { out._roblox = rb; console.log(`Roblox: ${Object.keys(rb).length} game dicek.`); }
  } catch (e) { console.error("Roblox:", String(e)); failed = true; }
}

/* ---------- Avora: jumlah terjual dari halaman produk publik (Avora belum punya API) ---------- */
const avoraUrls = [...new Set((win.PRODUCTS || []).map(p => String(p.url || "").trim()).filter(u => /^https:\/\/avora\.id\/\S+$/.test(u)))];
if (avoraUrls.length) {
  const sold = { ...(out._sold || {}) };
  for (const u of avoraUrls) {
    try {
      const res = await fetch(u, { headers: { "user-agent": "HonamiLinkInBioStats/1.0 (+https://honamichanhere.github.io)", "accept-language": "id" }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const mm = (await res.text()).match(/(\d[\d.,]*)\s*orang\s+sudah\s+beli/i);
      if (!mm) { console.warn("Avora: angka terjual tidak ditemukan di " + u + " (struktur halaman berubah?). Nilai lama dipakai."); }
      else sold[u] = Number(mm[1].replace(/[.,]/g, ""));
    } catch (e) { console.warn("Avora: gagal membaca " + u + " — " + String(e)); }
    await new Promise(r => setTimeout(r, 1500));
  }
  if (Object.keys(sold).length) { out._sold = sold; console.log("Avora: " + avoraUrls.length + " produk dicek."); }
}

const next = JSON.stringify(out, null, 2) + "\n";
if (JSON.stringify(out) !== before) { fs.writeFileSync(FILE, next); console.log("stats.json diperbarui."); }
else console.log("Tidak ada perubahan.");
if (failed) process.exitCode = 1;
