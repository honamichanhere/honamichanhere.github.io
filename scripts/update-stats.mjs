// Ambil jumlah tayang, judul, tanggal upload & durasi dari YouTube Data API
// untuk semua video di js/data.js, lalu simpan ke js/stats.json.
// Butuh env YT_API_KEY. Kalau kosong, script keluar tanpa error (stats.json tidak diubah).
import fs from "node:fs";
import vm from "node:vm";

const key = process.env.YT_API_KEY;
if (!key) { console.log("YT_API_KEY belum diset — lewati."); process.exit(0); }

const win = {};
vm.runInNewContext(fs.readFileSync("js/data.js", "utf8"), { window: win });
const ytId = s => { s = String(s || "").trim(); const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m ? m[1] : s.slice(0, 11); };
const ids = [...new Set([...(win.VIDEOS || []).map(v => ytId(v.yt)), ytId(win.SITE?.showreel)].filter(Boolean))];

const dur = iso => {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || ""); if (!m) return "";
  const [h, mi, s] = [m[1] || 0, m[2] || 0, m[3] || 0].map(Number), p = n => String(n).padStart(2, "0");
  return h ? `${h}:${p(mi)}:${p(s)}` : `${p(mi)}:${p(s)}`;
};

const out = {};
for (let i = 0; i < ids.length; i += 50) {
  const chunk = ids.slice(i, i + 50);
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${chunk.join(",")}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) { console.error("YouTube API error", res.status, await res.text()); process.exit(1); }
  for (const it of (await res.json()).items || []) {
    out[it.id] = {
      views: Number(it.statistics?.viewCount ?? 0),
      title: it.snippet?.title || "",
      uploaded: (it.snippet?.publishedAt || "").slice(0, 10),
      duration: dur(it.contentDetails?.duration),
    };
  }
}
const prev = fs.existsSync("js/stats.json") ? fs.readFileSync("js/stats.json", "utf8") : "";
const next = JSON.stringify(out, null, 2) + "\n";
if (prev !== next) { fs.writeFileSync("js/stats.json", next); console.log(`Updated ${Object.keys(out).length} videos.`); }
else console.log("Tidak ada perubahan.");
