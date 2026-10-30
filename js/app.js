(() => {
  const S = window.SITE, D = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, "0");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* teks -> HTML aman, URL dijadikan link */
  const linkify = txt => esc(txt).replace(/(https?:\/\/[^\s<]+)/g, m => { const tail = (m.match(/[.,;:!?)\]]+$/) || [""])[0], u = tail ? m.slice(0, -tail.length) : m; return `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>${tail}`; });
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* hanya izinkan skema aman untuk link yang berasal dari data (blokir javascript: dll) */
  const safeUrl = u => { u = String(u || "").trim(); return /^(https?:\/\/|mailto:|tel:|#|assets\/|\.\/)/i.test(u) ? u : ""; };
  [window.LINKS, window.OTHER_LINKS, window.GAMES, window.PRODUCTS, window.SCRIPTS].forEach(arr => (arr || []).forEach(o => { if ("url" in o) o.url = safeUrl(o.url); }));
  window.SITE.whatsapp = String(window.SITE.whatsapp || "").replace(/\D/g, "");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ---------- state ---------- */
  let lang = store.get("lang") || (/^id\b/i.test(navigator.language || "") ? "id" : "en");
  if (!D[lang]) lang = "id";
  const state = { type: "client", cat: "all", tag: "all", order: "", q: "" };
  let cur = null, curP = null, player = null, apiState = 0, statsDone = false, ext = { roblox: {}, sold: {}, avora: {} };

  const t = k => D[lang][k] ?? k;
  const L = x => (x && typeof x === "object" ? (x[lang] ?? x.id ?? "") : x ?? "");
  const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;

  /* ---------- data ---------- */
  const ytId = s => { s = String(s || "").trim(); const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m ? m[1] : s.slice(0, 11); };
  const seen = {};
  const ALL = window.VIDEOS.map(v => {
    const yt = ytId(v.yt); let id = v.id || yt; if (seen[id]) id += "-" + (++seen[id]); else seen[id] = 1;
    return { ...v, yt, id, type: v.type === "own" ? "own" : v.type === "other" ? "other" : "client", category: v.category || "Video", client: v.client || "", views: v.views ?? null };
  });
  const descOf = v => L(v.desc) || v.descAuto || "";
  const fRank = v => v.featured ? (typeof v.featured === "number" ? v.featured : 999) : 1e9;   /* featured: angka kecil = paling depan */
  const sortAll = () => ALL.sort((a, b) => fRank(a) - fRank(b) || (b.at || b.uploaded || "").localeCompare(a.at || a.uploaded || ""));
  sortAll();
  const EDIT = () => ALL.filter(v => v.type !== "other"), OTV = () => ALL.filter(v => v.type === "other");
  const byId = Object.fromEntries(ALL.map(v => [v.id, v]));
  const PR = window.PRODUCTS.map((p, i) => ({ ...p, kind: "product", id: p.id || "p" + (i + 1), images: p.images || [] }));
  const SC = (window.SCRIPTS || []).map((s, i) => ({ ...s, kind: "script", id: s.id || "s" + (i + 1), images: s.images || [] }));
  const byItem = Object.fromEntries([...PR, ...SC].map(p => [p.kind[0] + "/" + p.id, p]));
  /* jumlah terjual: otomatis (stats.json, dibaca dari halaman Avora) lalu cadangan manual */
  const soldOf = p => { const n = ext.sold[p.url] ?? p.sold; return n == null ? null : Number(n); };
  const soldTxt = p => { const n = soldOf(p); return n == null ? "" : `${n >= 10000 ? compact(n) : new Intl.NumberFormat(loc()).format(n)} ${t("sold")}`; };
  /* judul & harga produk: dicerminkan dari halaman Avora (stats.json). Nilai di data.js jadi cadangan; mirror: false = matikan */
  const avOf = p => (p.mirror !== false && p.url && ext.avora[p.url]) || null;
  const nameOf = p => (avOf(p) && avOf(p).title) || L(p.name);
  const priceOf = p => ({ now: (avOf(p) && avOf(p).price) || p.price || "", old: (avOf(p) && avOf(p).oldPrice) || p.oldPrice || "" });
  const itemHash = p => `#/${p.kind[0]}/${p.id}`;
  const listOfItem = p => (p.kind === "script" ? SC : PR);

  /* ---------- helpers ---------- */
  const oar = id => `https://i.ytimg.com/vi/${id}/oar2.jpg`;   /* thumbnail dengan rasio ASLI video (vertikal untuk Shorts/Reels) */
  const thumb = id => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const thumbLo = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  /* rasio video (lebar/tinggi): manual (ratio: "9:16") > hasil deteksi (stats.json / gambar oar2) > 16:9 */
  const R169 = 16 / 9;
  const parseRatio = x => { if (!x) return 0; if (typeof x === "number") return x; const m = String(x).match(/^\s*(\d+(?:\.\d+)?)\s*[:x/]\s*(\d+(?:\.\d+)?)\s*$/); return m ? +m[1] / +m[2] : 0; };
  const rCache = (() => { try { return JSON.parse(store.get("yt-ratio")) || {}; } catch { return {}; } })();
  const byYt = Object.fromEntries(ALL.map(v => [v.yt, v]));
  const clampR = r => Math.min(2.4, Math.max(.4, r));
  const ratioYt = yt => { const v = byYt[yt]; return clampR((v && (parseRatio(v.ratio) || v.ratioAuto)) || rCache[yt] || R169); };
  const ratioOf = v => clampR(parseRatio(v.ratio) || v.ratioAuto || rCache[v.yt] || R169);
  /* "fit": video yang lebih tinggi dari 16:9 ditampilkan utuh di kotak 16:9 (bukan dipotong) */
  const applyFit = (el, r) => { el.classList.toggle("fit", r < R169 - .06); el.style.setProperty("--r", r.toFixed(4)); };
  function setRatio(yt, r) {
    if (Math.abs((rCache[yt] || 0) - r) > .005) { rCache[yt] = +r.toFixed(4); store.set("yt-ratio", JSON.stringify(rCache)); }
    $$(`[data-yt="${yt}"]`).forEach(el => applyFit(el, el.dataset.vid && byId[el.dataset.vid] ? ratioOf(byId[el.dataset.vid]) : ratioYt(yt)));
    if (cur && cur.yt === yt) $(".frame").style.setProperty("--r", ratioOf(cur).toFixed(4));
  }
  const img = (id, alt = "") => {
    const i = new Image(); i.alt = alt; i.loading = "lazy"; i.decoding = "async"; i.src = oar(id);
    let step = 0;
    const next = () => { step++; i.src = step === 1 ? thumb(id) : thumbLo(id); };
    i.addEventListener("error", () => { if (step < 2) next(); });
    i.addEventListener("load", () => {
      if (step === 0) { if (i.naturalWidth > 120) setRatio(id, i.naturalWidth / i.naturalHeight); else next(); }
      else if (i.naturalWidth <= 120 && step < 2) next();
    });
    return i;
  };
  const loc = () => (lang === "id" ? "id-ID" : "en-US");
  const compact = n => new Intl.NumberFormat(loc(), { notation: "compact", maximumFractionDigits: 1 }).format(n);
  const ago = d => {
    if (!d) return "";
    const days = Math.round((new Date(d) - Date.now()) / 864e5), rtf = new Intl.RelativeTimeFormat(loc(), { numeric: "auto" }), a = Math.abs(days);
    if (a < 7) return rtf.format(days, "day");
    if (a < 30) return rtf.format(Math.round(days / 7), "week");
    if (a < 365) return rtf.format(Math.round(days / 30), "month");
    return rtf.format(Math.round(days / 365), "year");
  };
  const longDate = d => d ? new Date(d).toLocaleDateString(loc(), { day: "numeric", month: "long", year: "numeric" }) : "";
  const contactUrl = text => S.whatsapp
    ? `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`
    : `mailto:${S.email}?subject=${encodeURIComponent("Video project")}&body=${encodeURIComponent(text)}`;
  let tt; const toast = msg => { const el = $("#toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 2200); };
  const copyText = async txt => { try { await navigator.clipboard.writeText(txt); return true; } catch { prompt("Copy:", txt); return false; } };
  const lockBody = () => document.body.classList.toggle("lock", !!(cur || curP));

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add("in");
    setTimeout(() => el.classList.remove("reveal", "in"), 1500);
  }), { threshold: .08, rootMargin: "0px 0px -4% 0px" });
  const observeReveal = (els, mod) => els.forEach((el, i) => { el.classList.add("reveal"); if (mod) el.style.setProperty("--i", i % mod); io.observe(el); });

  /* YouTube IFrame API (dipakai pemutar & hover preview) */
  function loadAPI(cb) {
    if (window.YT && YT.Player) return cb();
    if (!apiState) { apiState = 1; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.append(s); }
    const prev = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { prev && prev(); cb(); };
  }

  /* ---------- static bits ---------- */
  $("#brand").innerHTML = S.logo ? `<img src="${esc(S.logo)}" alt=""><span>${esc(S.name)}</span>` : `<i class="mark"></i><span>${esc(S.name)}</span>`;
  if (S.logo) { $("#avatar").src = S.logo; $("#avatar").hidden = false; $$("link[rel=icon]").forEach(l => { l.href = S.logo; l.type = /\.jpe?g$/i.test(S.logo) ? "image/jpeg" : /\.webp$/i.test(S.logo) ? "image/webp" : "image/png"; }); }
  $$("[data-site]").forEach(el => el.textContent = S[el.dataset.site] ?? "");
  if (S.banner) { $("#banner").src = S.banner; $("#banner-wrap").hidden = false; }
  $("#year").textContent = new Date().getFullYear();
  $("#tools").innerHTML = (S.tools || []).map(x => `<span class="tag">${esc(x)}</span>`).join("");

  /* ---------- BIODATA ---------- */
  const linkEl = (l, primary) => {
    const copy = l.copy, mail = /^mailto:/.test(l.url);
    return `<a class="link glass${primary && l.primary ? " primary" : ""}" href="${esc(l.url)}"${copy ? ` data-copy="${esc(l.url.replace(/^mailto:/, ""))}"` : mail ? "" : ' target="_blank" rel="noopener noreferrer"'}>
      <span class="ic">${ico(l.icon || "link")}</span><span class="txt"><b>${esc(l.label)}</b><small>${esc(L(l.sub || l.desc) || "")}</small></span><span class="go">${ico(copy ? "copy" : "arrow")}</span></a>`;
  };
  document.addEventListener("click", async e => {
    const a = e.target.closest("[data-copy]"); if (!a) return;
    e.preventDefault(); if (await copyText(a.dataset.copy)) toast(t("toast.copied"));
  });
  const autoStat = {
    videos: () => ({ n: EDIT().length, suffix: "", label: t("stat.videos") }),
    clients: () => ({ n: new Set(EDIT().map(v => v.client).filter(Boolean)).size, suffix: "", label: t("stat.clients") }),
    views: () => ({ n: EDIT().reduce((a, v) => a + (v.views || 0), 0), suffix: "", compact: true, label: t("stat.views") }),
  };
  const statVal = (n, sfx, c) => (c ? compact(n) : n + sfx);
  function renderBio() {
    $("#badges").innerHTML = (S.badges || []).map(b => `<span>${esc(L(b))}</span>`).join("");
    $("#about-text").textContent = L(S.about);
    $("#headline").textContent = L(S.role);
    $("#links").innerHTML = window.LINKS.filter(l => l.url).map(l => linkEl(l, true)).join("");
    observeReveal($$(".link", $("#links")), 6);
    $("#stats").innerHTML = S.stats.map(s => {
      const r = s.auto && autoStat[s.auto] ? autoStat[s.auto]() : { n: s.n, suffix: s.suffix || "", compact: false, label: L(s.label) };
      return `<li><strong data-n="${r.n}" data-s="${esc(r.suffix)}" data-c="${r.compact ? 1 : 0}">${statVal(r.n, r.suffix, r.compact)}</strong><span>${esc(r.label)}</span></li>`;
    }).join("");
  }
  function countUp() {
    if (statsDone) return; statsDone = true;
    $$("#stats strong").forEach(el => {
      const n = +el.dataset.n, sfx = el.dataset.s, c = el.dataset.c === "1", t0 = performance.now();
      const step = now => { const p = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - p, 4); el.textContent = statVal(Math.round(n * e), sfx, c); if (p < 1) requestAnimationFrame(step); };
      if (calm) el.textContent = statVal(n, sfx, c); else requestAnimationFrame(step);
    });
  }
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { countUp(); o.disconnect(); } }, { threshold: .3 }).observe($("#stats"));

  /* ---------- DISCOVER (sorotan; muncul hanya kalau ada item) ---------- */
  const rank = x => (x.discover === true ? 99 : +x.discover || 99);
  function discoverItems() {
    const out = [];
    SC.filter(s => s.discover).forEach(s => out.push({ kind: "script", r: rank(s), title: L(s.name), sub: L(s.header), href: itemHash(s), key: itemHash(s), image: s.images[0], icon: "code", cta: t("spot.open") }));
    ALL.filter(v => v.discover).forEach(v => out.push({ kind: "video", r: rank(v), title: L(v.title) || "…", sub: (descOf(v).split("\n").map(x => x.trim()).find(Boolean) || "").slice(0, 150) || [v.category, v.views != null ? `${compact(v.views)} ${t("views")}` : "", ago(v.uploaded)].filter(Boolean).join(" • "), href: `#/v/${v.id}`, key: "v:" + v.id, yt: v.yt, vid: v.id, cta: t("spot.open") }));
    PR.filter(p => p.discover).forEach(p => out.push({ kind: "product", r: rank(p), title: nameOf(p), sub: L(p.header), href: itemHash(p), key: itemHash(p), image: p.images[0], icon: "store", price: [priceOf(p).now, soldTxt(p)].filter(Boolean).join(" • "), cta: t("spot.open") }));
    window.GAMES.forEach((g, gi) => { if (!g.discover || !g.url) return; const r = (g.placeId && ext.roblox[g.placeId]) || {}; out.push({ kind: "game", r: rank(g), title: L(g.name) || r.name || "Game", sub: L(g.desc) || r.description || "", href: g.url, key: "g:" + gi, image: g.image || r.image, icon: "roblox", cta: t("spot.open") }); });
    return out.sort((a, b) => a.r - b.r);
  }
  function renderDiscover() {
    const items = discoverItems(), sec = $("#discover"), spot = $("#spot");
    sec.hidden = !items.length; $("#nav-discover").hidden = !items.length;
    spot.classList.toggle("hero", items.length >= 3);
    spot.innerHTML = "";
    items.forEach(it => {
      const a = document.createElement("a");
      a.className = "spot-card"; a.href = it.href; a.dataset.key = it.key;
      a.innerHTML = `<span class="spot-ribbon">${ico("star")}${esc(t("spot.label"))}</span>
        <div class="spot-img"${it.yt ? ` data-yt="${esc(it.yt)}" data-vid="${esc(it.vid)}"` : ""}><span class="badge">${esc(t("kind." + it.kind))}</span>${it.kind === "video" ? `<span class="spot-play">${ico("play")}</span>` : ""}${it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy"${it.key[0] === "g" ? ' referrerpolicy="no-referrer"' : ""}>` : it.yt ? "" : ico(it.icon || "star")}</div>
        <div class="spot-body"><h3>${esc(it.title)}</h3><p>${esc(it.sub)}</p>
          <div class="spot-foot"><span class="btn btn-sm">${esc(it.cta)}${ico("arrow")}</span>${it.price ? `<small>${esc(it.price)}</small>` : ""}</div></div>`;
      if (it.yt) { const si = $(".spot-img", a); applyFit(si, byId[it.vid] ? ratioOf(byId[it.vid]) : ratioYt(it.yt)); si.prepend(img(it.yt, it.title)); }
      spot.append(a);
    });
    observeReveal($$(".spot-card"), 6);
    requestAnimationFrame(() => { placeDock(); onScroll(); });
  }

  /* klik kartu Discover = scroll ke tempat aslinya (bukan membuka popup) */
  const flashEl = el => { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 2300); };
  function goSpot(key) {
    let wait = 60;
    const open = k => { const r = moreRefs[k](); if (!moreOpen[k]) { setMore(k, r.wrap, r.btn, true); wait = calm ? 80 : 720; } };
    if (key[0] === "v") {
      const v = byId[key.slice(2)]; if (!v) return false;
      if (v.type === "other") { /* sudah tampil di Other */ }
      else {
        if (state.type !== v.type) { state.type = v.type; state.cat = "all"; renderSeg(); renderFilters(); applyFilter(true); }
        else if (state.cat !== "all" && v.category !== state.cat) { state.cat = "all"; renderFilters(); applyFilter(true); }
        const c = cards.find(x => x.dataset.id === v.id); if (c && c.parentElement === gridMore) open("videos");
      }
    } else if (key[0] === "#" && key[2] === "p") {
      const el = productEls.find(x => x.dataset.key === key);
      if (el && el.hidden) { state.tag = "all"; renderStore(); }
      const el2 = productEls.find(x => x.dataset.key === key); if (el2 && el2.parentElement === $("#products-more")) open("store");
    }
    const target = key[0] === "v" ? $(`.card[data-id="${key.slice(2)}"]`) : $(`[data-key="${key}"]:not(.spot-card)`);
    if (!target) return false;
    setTimeout(() => {
      const y = target.getBoundingClientRect().top + scrollY - Math.max(0, (innerHeight - target.offsetHeight) / 2);
      scrollTo({ top: Math.max(0, y), behavior: calm ? "auto" : "smooth" }); flashEl(target);
    }, wait);
    return true;
  }
  $("#spot").addEventListener("click", e => {
    const a = e.target.closest(".spot-card"); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (goSpot(a.dataset.key)) e.preventDefault();
  });

  /* ---------- EDIT ---------- */
  const grid = $("#grid"), gridMore = $("#grid-more"); let cards = [];
  const LIMIT = Math.max(1, +S.showLimit || 10);
  const moreOpen = { videos: false, store: false };

  /* "See more": tampilkan LIMIT item pertama, sisanya masuk wadah yang bisa dibuka-tutup */
  function setMore(key, wrap, btn, open, animate = true) {
    moreOpen[key] = open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      wrap.classList.add("open");
      const done = () => wrap.classList.add("settled");
      animate && !calm ? setTimeout(done, 650) : done();
    } else {
      wrap.classList.remove("settled"); wrap.classList.remove("open");
    }
    labelMore(key);
  }
  const moreRefs = {
    videos: () => ({ wrap: $("#more"), btn: $("#more-btn"), main: grid, extra: gridMore }),
    store: () => ({ wrap: $("#smore"), btn: $("#smore-btn"), main: $("#products"), extra: $("#products-more") }),
  };
  function labelMore(key) {
    const { btn } = moreRefs[key](), n = +btn.dataset.n || 0;
    $("span", btn).textContent = moreOpen[key] ? t("more.hide") : t("more.show").replace("{n}", n);
    btn.classList.toggle("is-open", moreOpen[key]);
  }
  function distribute(key, items) {
    const { wrap, btn, main, extra } = moreRefs[key](), vis = items.filter(el => !el.hidden);
    vis.forEach((el, i) => (i < LIMIT ? main : extra).append(el));
    items.filter(el => el.hidden).forEach(el => main.append(el));
    const n = Math.max(0, vis.length - LIMIT);
    btn.dataset.n = n; btn.parentElement.hidden = n === 0;
    if (n === 0 && moreOpen[key]) setMore(key, wrap, btn, false, false);
    labelMore(key);
  }
  $("#more-btn").addEventListener("click", () => { const r = moreRefs.videos(); stopPreview(); setMore("videos", r.wrap, r.btn, !moreOpen.videos); });
  $("#smore-btn").addEventListener("click", () => { const r = moreRefs.store(); setMore("store", r.wrap, r.btn, !moreOpen.store); });
  const inType = () => ALL.filter(v => v.type === state.type);
  function renderSeg() {
    $("#n-client").textContent = ALL.filter(v => v.type === "client").length;
    $("#n-own").textContent = ALL.filter(v => v.type === "own").length;
    $$("#seg button").forEach(b => b.classList.toggle("is-on", b.dataset.type === state.type));
    placeSeg();
  }
  function placeSeg() {
    const b = $("#seg .is-on"), ind = $(".seg-ind");
    if (b) { ind.style.width = b.offsetWidth + "px"; ind.style.transform = `translateX(${b.offsetLeft}px)`; }
  }
  function renderFilters() {
    const cats = [...new Set(inType().map(v => v.category))];
    if (state.cat !== "all" && !cats.includes(state.cat)) state.cat = "all";
    $("#filters").innerHTML = cats.length > 1 ? [["all", t("edit.all")], ...cats.map(c => [c, c])].map(([v, l]) => `<button class="chip${state.cat === v ? " is-on" : ""}" data-v="${esc(v)}">${esc(l)}</button>`).join("") : "";
  }
  function makeCard(v) {
    const a = document.createElement("a");
    a.className = "card glass"; a.href = `#/v/${v.id}`; a.dataset.id = v.id;
    a.innerHTML = `<div class="thumb" data-yt="${esc(v.yt)}" data-vid="${esc(v.id)}"><span class="badge">${esc(v.category)}</span>${v.duration ? `<span class="dur">${esc(v.duration)}</span>` : ""}</div>
      <div class="card-body"><h3>${esc(L(v.title) || "…")}</h3><div class="card-meta">${[v.type === "client" ? v.client : "", v.views != null ? `${compact(v.views)} ${t("views")}` : "", ago(v.uploaded)].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("")}</div></div>`;
    const th = $(".thumb", a); applyFit(th, ratioOf(v)); th.prepend(img(v.yt, L(v.title)));
    return a;
  }
  function renderCards() {
    stopPreview(); grid.innerHTML = ""; gridMore.innerHTML = "";
    cards = EDIT().map(v => { const a = makeCard(v); grid.append(a); return a; });
    applyFilter(true); observeReveal(cards.filter(c => !c.hidden && c.parentElement === grid), 6);
  }
  function applyFilter(instant) {
    const first = new Map(cards.filter(c => !c.hidden && c.parentElement === grid).map(c => [c, c.getBoundingClientRect()]));
    let n = 0;
    const q = state.q.trim().toLowerCase();
    cards.forEach(c => {
      const v = byId[c.dataset.id];
      c.hidden = v.type !== state.type || (state.cat !== "all" && v.category !== state.cat) || (q && ![L(v.title), v.category, v.client, (v.tools || []).join(" ")].join(" ").toLowerCase().includes(q));
      if (!c.hidden) n++;
    });
    distribute("videos", cards);
    cards.forEach(c => { if (c.parentElement === gridMore) c.classList.remove("reveal", "in"); });
    $("#empty").hidden = n > 0;
    $("#order").hidden = state.type !== "client";
    if (instant === true || calm) return;
    cards.forEach(c => {
      if (c.hidden || c.parentElement !== grid) return; c.classList.remove("reveal", "in");
      const l = c.getBoundingClientRect(), p = first.get(c);
      if (p) { const dx = p.left - l.left, dy = p.top - l.top; if (dx || dy) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.2,.8,.2,1)" }); }
      else c.animate([{ opacity: 0, transform: "translateY(18px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 480, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }
  const qi = $("#q"), qx = $("#q-x");
  qi.addEventListener("input", () => { state.q = qi.value; qx.hidden = !qi.value; stopPreview(); applyFilter(); });
  qx.addEventListener("click", () => { qi.value = ""; state.q = ""; qx.hidden = true; qi.focus(); stopPreview(); applyFilter(); });
  $("#seg").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.dataset.type === state.type) return;
    stopPreview(); state.type = b.dataset.type; state.cat = "all"; { const r = moreRefs.videos(); setMore("videos", r.wrap, r.btn, false, false); } renderSeg(); renderFilters(); applyFilter();
  });
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.cat = b.dataset.v; $$(".chip", $("#filters")).forEach(c => c.classList.toggle("is-on", c === b)); applyFilter();
  });

  /* accordion (panel order, FAQ, panduan script) */
  const bindAccordion = root => root.addEventListener("click", e => {
    const q = e.target.closest(".qa-q"); if (!q || !root.contains(q)) return;
    const item = q.parentElement, open = !item.classList.contains("open");
    $$(".qa", root).forEach(o => { o.classList.remove("open"); $(".qa-q", o).setAttribute("aria-expanded", "false"); });
    if (open) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
  });

  /* order panel (ringkas, animasi buka-tutup mulus) */
  const qaHtml = (q, aHtml, open) => `<div class="qa${open ? " open" : ""}"><button class="qa-q" aria-expanded="${open ? "true" : "false"}">${esc(q)}</button><div class="qa-a"><div>${aHtml}</div></div></div>`;
  function orderHtml(kind) {
    if (kind === "price") return `<p class="order-note">${esc(t("order.note"))}</p>${window.PRICING.map(g => `
      <div class="pgroup"><div class="pg-head"><h3>${esc(L(g.name))}</h3>${g.desc ? `<span>${esc(L(g.desc))}</span>` : ""}</div>
      <div class="plans">${g.plans.map((p, i) => { const nm = L(p.name) || (g.plans.length > 1 ? `${t("order.plan")} ${i + 1}` : ""); return `
        <div class="plan${p.popular ? " pop" : ""}">${p.popular ? `<span class="pop-tag">${esc(t("order.popular"))}</span>` : ""}
          ${nm ? `<h4>${esc(nm)}</h4>` : ""}<div class="price">${esc(p.price)}<small>${esc(L(p.unit))}</small></div>
          <ul>${p.features.map(f => `<li>${esc(L(f))}</li>`).join("")}</ul>
          <a class="btn btn-sm" href="${esc(contactUrl(t("msg.pkg").replace("{n}", `${[L(g.name), nm].filter(Boolean).join(" · ")} (${p.price})`)))}" target="_blank" rel="noopener">${esc(t("order.pick"))}</a>
        </div>`; }).join("")}</div></div>`).join("")}`;
    if (kind === "steps") return `<ol class="steps">${[1, 2, 3, 4].map(i => `<li><b>0${i}</b><h4>${esc(t("step." + i + "t"))}</h4><p>${esc(t("step." + i + "d"))}</p></li>`).join("")}</ol>`;
    return window.FAQ.map(f => qaHtml(L(f.q), `<p>${esc(L(f.a))}</p>`)).join("");
  }
  function renderOrder() {
    $("#order-wa").href = contactUrl(t("msg.generic"));
    const body = $("#order-body"), inner = $("#order-inner");
    $$("#order-tabs button").forEach(b => b.classList.toggle("is-on", b.dataset.o === state.order));
    body.classList.toggle("open", !!state.order);
    if (state.order) inner.innerHTML = `<div class="oi">${orderHtml(state.order)}</div>`;
  }
  $("#order-tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.order = state.order === b.dataset.o ? "" : b.dataset.o; renderOrder(); });
  bindAccordion($("#order-inner"));

  /* hover preview (desktop saja) — pakai IFrame API tanpa mode playlist, jadi tidak ada tombol prev/pause/next */
  let hov = { card: null, timer: 0, player: null };
  function stopPreview() {
    clearTimeout(hov.timer);
    try { hov.player && hov.player.destroy(); } catch {}
    hov = { card: null, timer: 0, player: null };
  }
  function startPreview(c) {
    stopPreview(); hov.card = c;
    hov.timer = setTimeout(() => loadAPI(() => {
      if (hov.card !== c) return;
      const v = byId[c.dataset.id], holder = document.createElement("div"), st = v.preview || 0;
      $(".thumb", c).append(holder);
      hov.player = new YT.Player(holder, {
        width: "100%", height: "100%", videoId: v.yt,
        playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, modestbranding: 1, rel: 0, disablekb: 1, iv_load_policy: 3, fs: 0, start: st },
        events: {
          onReady: e => { try { e.target.mute(); e.target.playVideo(); } catch {} },
          onStateChange: e => {
            const f = e.target.getIframe && e.target.getIframe();
            if (e.data === 1 && f) { f.setAttribute("tabindex", "-1"); f.setAttribute("aria-hidden", "true"); f.classList.add("on"); }
            if (e.data === 0) { e.target.seekTo(st); e.target.playVideo(); }
          },
        },
      });
    }), 300);
  }

  /* ---------- STORE ---------- */
  const pThumb = p => p.images[0]
    ? `<img src="${esc(p.images[0])}" alt="${esc(nameOf(p))}" loading="lazy">`
    : ico(p.kind === "script" ? "code" : "store");
  let productEls = [];
  function renderStore() {
    const tags = [...new Set(PR.map(p => p.tag).filter(Boolean))];
    if (state.tag !== "all" && !tags.includes(state.tag)) state.tag = "all";
    $("#store-filters").innerHTML = tags.length > 1 ? [["all", t("store.all")], ...tags.map(x => [x, x])].map(([v, l]) => `<button class="chip${state.tag === v ? " is-on" : ""}" data-v="${esc(v)}">${esc(l)}</button>`).join("") : "";
    const main = $("#products"), extra = $("#products-more");
    main.innerHTML = ""; extra.innerHTML = "";
    productEls = PR.map(p => {
      const a = document.createElement("a");
      a.className = "product glass"; a.href = itemHash(p); a.dataset.tag = p.tag || ""; a.dataset.key = itemHash(p);
      a.innerHTML = `<div class="p-img">${pThumb(p)}${p.tag ? `<span class="badge">${esc(p.tag)}</span>` : ""}</div>
        <div class="p-body"><h3>${esc(nameOf(p))}</h3><p>${esc(L(p.header))}</p>${soldTxt(p) ? `<span class="p-sold">${ico("store")}${esc(soldTxt(p))}</span>` : ""}
          <div class="p-foot"><div class="p-pricebox"><span class="p-price">${esc(priceOf(p).now)}</span>${priceOf(p).old && priceOf(p).old !== priceOf(p).now ? `<s class="p-old">${esc(priceOf(p).old)}</s>` : ""}</div><span class="btn btn-sm">${esc(t("store.see"))}${ico("arrow")}</span></div></div>`;
      a.hidden = state.tag !== "all" && p.tag !== state.tag;
      main.append(a); return a;
    });
    distribute("store", productEls);
    observeReveal(productEls.filter(el => !el.hidden && el.parentElement === main), 6);
  }
  $("#store-filters").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.tag = b.dataset.v; $$(".chip", $("#store-filters")).forEach(c => c.classList.toggle("is-on", c === b));
    productEls.forEach(el => { el.hidden = state.tag !== "all" && el.dataset.tag !== state.tag; });
    distribute("store", productEls);
  });

  /* slider (produk & script) */
  const slides = $("#slides"), dots = $("#dots");
  let slideIdx = 0;
  function buildSlider(p) {
    slides.innerHTML = (p.images.length ? p.images : [""]).map(src => `<div class="slide">${src ? `<img src="${esc(src)}" alt="${esc(nameOf(p))}" draggable="false">` : ico(p.kind === "script" ? "code" : "store")}</div>`).join("");
    const n = slides.children.length;
    dots.innerHTML = n > 1 ? Array.from({ length: n }, (_, i) => `<button data-i="${i}" aria-label="Image ${i + 1}"></button>`).join("") : "";
    $("#s-prev").hidden = $("#s-next").hidden = n < 2;
    slideIdx = 0; slides.scrollLeft = 0; markDot();
    const sl = $("#slider"); sl.style.removeProperty("--sr");
    if (p.images[0]) { const i = new Image(); i.onload = () => { if (i.naturalHeight) sl.style.setProperty("--sr", (i.naturalWidth / i.naturalHeight).toFixed(4)); }; i.src = p.images[0]; }
  }
  const markDot = () => $$("button", dots).forEach((d, i) => d.classList.toggle("on", i === slideIdx));
  const goSlide = i => { const n = slides.children.length; slideIdx = (i + n) % n; slides.scrollTo({ left: slideIdx * slides.clientWidth, behavior: calm ? "auto" : "smooth" }); markDot(); };
  slides.addEventListener("scroll", () => { const i = Math.round(slides.scrollLeft / (slides.clientWidth || 1)); if (i !== slideIdx) { slideIdx = i; markDot(); } }, { passive: true });
  $("#s-prev").onclick = () => goSlide(slideIdx - 1); $("#s-next").onclick = () => goSlide(slideIdx + 1);
  dots.addEventListener("click", e => { const b = e.target.closest("button"); if (b) goSlide(+b.dataset.i); });

  /* modal detail (produk & script) */
  const pmodal = $("#pmodal");
  function fillScript(p) {
    $("#sx-code").textContent = p.loader || "";
    const games = (p.games || []), feats = (p.features || []);
    $("#sx-games").innerHTML = games.map(g => `<span class="tag${g.soon ? " soon" : ""}">${esc(L(g.label))}</span>`).join("");
    $("#sx-games-l").hidden = $("#sx-games").hidden = !games.length;
    $("#sx-feats").innerHTML = feats.map(f => `<div${f.wide ? ' class="wide"' : ""}>${esc(L(f.t))}<small>${esc(L(f.s))}</small></div>`).join("");
    $("#sx-feats-l").hidden = $("#sx-feats").hidden = !feats.length;
    /* daftar harga langganan + cara order */
    const pr = p.pricing, plans = (pr && pr.plans) || [], on = plans.length > 0;
    $("#sx-price-l").hidden = $("#sx-prices").hidden = !on; $("#sx-pnote").hidden = !(on && pr.note);
    $("#sx-pnote").textContent = on ? L(pr.note) : "";
    $("#sx-prices").innerHTML = plans.map(x => `<div class="sx-price${x.best ? " best" : ""}">${x.best ? `<i class="tag-best">${esc(t("script.best"))}</i>` : ""}<b>${esc(L(x.label))}</b><span>${esc(x.price)}</span></div>`).join("");
    const ord = on && pr.order, ordUrl = ord ? safeUrl(ord.url) : "";
    $("#sx-order").hidden = !ordUrl; if (ordUrl) { $("#sx-order").href = ordUrl; $("#sx-order-t").textContent = [L(ord.text), ord.label].filter(Boolean).join(" "); }
    const stepsHtml = (p.steps || []).length ? `<ol class="sx-steps">${p.steps.map(s => `<li>${esc(L(s))}</li>`).join("")}</ol>` : "";
    $("#sx-guide").innerHTML = (stepsHtml ? qaHtml(t("script.steps"), stepsHtml, false) : "") + (p.guide || []).map(g => qaHtml(L(g.q), `<p>${esc(L(g.a))}</p>`)).join("");
    $("#sx-note").textContent = L(p.note) || "";
  }
  bindAccordion($("#sx-guide"));
  function fillP() {
    const p = curP, list = listOfItem(p), script = p.kind === "script";
    pmodal.classList.toggle("is-script", script);
    $("#p-no").textContent = pad(list.indexOf(p) + 1); $("#p-total").textContent = pad(list.length);
    $("#p-tag").textContent = [p.tag, script && p.status ? L(p.status) : ""].filter(Boolean).join(" • "); $("#p-tag").hidden = !p.tag;
    $("#p-title").textContent = nameOf(p); $("#p-header").textContent = L(p.header); $("#p-header").hidden = !p.header;
    { const pr = priceOf(p), disc = pr.old && pr.old !== pr.now; $("#p-price").textContent = pr.now; $("#p-old").textContent = disc ? pr.old : ""; $("#p-old").hidden = !disc; $("#p-pricerow").hidden = script || !pr.now; }
    $("#p-desc").textContent = L(p.desc);
    { const st = script ? "" : soldTxt(p); $("#p-sold").hidden = !st; $("#p-sold").innerHTML = st ? `${ico("store")}${esc(st)}` : ""; }
    $("#p-script").hidden = !script;
    const buy = $("#p-buy"); buy.hidden = script; buy.href = p.url || "#"; buy.setAttribute("aria-disabled", p.url ? "false" : "true");
    $("#sx-copy").hidden = !script || !p.loader;
    if (script) fillScript(p);
    $("#pprev").disabled = $("#pnext").disabled = list.length < 2;
  }
  function openP(key) {
    const p = byItem[key]; if (!p) return; const changed = curP !== p; curP = p; closeV(false); stopPreview();
    fillP(); if (changed) buildSlider(p);
    pmodal.classList.add("open"); pmodal.setAttribute("aria-hidden", "false"); lockBody();
  }
  function closeP(updateHash = true) {
    if (!curP) return; curP = null;
    pmodal.classList.remove("open"); pmodal.setAttribute("aria-hidden", "true"); lockBody();
    if (updateHash && /^#\/[ps]\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#" + activeId);
  }
  const stepP = d => { const list = listOfItem(curP), i = list.indexOf(curP); location.replace(itemHash(list[(i + d + list.length) % list.length])); };
  pmodal.addEventListener("click", e => { if (e.target.closest("[data-pclose]")) closeP(); });
  $("#pprev").onclick = () => stepP(-1); $("#pnext").onclick = () => stepP(1);
  $("#sx-copy").onclick = async () => { if (curP && curP.loader && await copyText(curP.loader)) toast(t("script.copied")); };

  /* ---------- OTHER ---------- */
  function renderOther() {
    /* script & tools */
    $("#scripts").innerHTML = SC.map(s => `
      <a class="product glass" href="${esc(itemHash(s))}" data-key="${esc(itemHash(s))}">
        <div class="p-img wide">${pThumb(s)}${s.tag ? `<span class="badge">${esc(s.tag)}</span>` : ""}${s.status ? `<span class="chip-status">${esc(L(s.status))}</span>` : ""}</div>
        <div class="p-body"><h3>${esc(L(s.name))}</h3><p>${esc(L(s.header))}</p>
          <div class="p-foot"><span></span><span class="btn btn-sm">${esc(t("script.open"))}${ico("arrow")}</span></div></div>
      </a>`).join("");
    $("#scripts-h").hidden = !SC.length;
    /* video lain (tutorial dll) */
    stopPreview();
    const ov = $("#ovideos"); ov.innerHTML = "";
    OTV().forEach(v => ov.append(makeCard(v)));
    $("#ovideos-h").hidden = !OTV().length;
    /* game */
    $("#games").innerHTML = window.GAMES.map((g, gi) => {
      const r = (g.placeId && ext.roblox[g.placeId]) || {}, name = L(g.name) || r.name || "Game", image = g.image || r.image;
      return `<article class="game glass" data-key="g:${gi}">
        <div class="g-img">${image ? `<img src="${esc(image)}" alt="${esc(name)}" loading="lazy" referrerpolicy="no-referrer">` : ico("roblox")}</div>
        <div class="g-body"><h3>${esc(name)}</h3><p>${esc(L(g.desc) || r.description || "")}</p>
          ${r.playing != null || r.visits != null ? `<div class="g-stats">${r.playing != null ? `<span><b>${compact(r.playing)}</b> ${esc(t("game.playing"))}</span>` : ""}${r.visits != null ? `<span><b>${compact(r.visits)}</b> ${esc(t("game.visits"))}</span>` : ""}</div>` : ""}
          ${g.url ? `<a class="btn btn-sm" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">${esc(t("game.play"))}${ico("arrow")}</a>` : `<span class="btn btn-sm btn-ghost" aria-disabled="true">${esc(t("game.soon"))}</span>`}</div>
      </article>`;
    }).join("");
    $("#games-h").hidden = !window.GAMES.length;
    $("#olinks").innerHTML = window.OTHER_LINKS.filter(l => l.url).map(l => linkEl(l, false)).join("");
    $("#olinks-h").hidden = !$("#olinks .link");
    observeReveal([...$$("#scripts .product"), ...$$("#ovideos .card"), ...$$(".game"), ...$$("#olinks .link")], 6);
  }

  /* ---------- i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = lang; $("#q").placeholder = t("edit.search");
    $$("[data-i18n]").forEach(el => el.innerHTML = t(el.dataset.i18n));
    document.title = `${S.name} — ${L(S.role)}`;
    $("#lang").dataset.l = lang; $$("#lang button").forEach(b => b.classList.toggle("is-on", b.dataset.lang === lang));
    renderBio(); if (statsDone) { statsDone = false; countUp(); }
    renderDiscover(); renderSeg(); renderFilters(); renderOrder(); renderStore(); renderOther();
    if (cur) fillModal(); if (curP) fillP();
    labelMore("videos"); labelMore("store");
    requestAnimationFrame(() => { placeSeg(); placeDock(); });
  }
  $("#lang").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set("lang", lang); applyI18n(); renderCards();
  });

  /* ---------- dock: scroll-spy + indikator ---------- */
  const nav = $("#nav"), ind = $("#ind"), bar = $("#progress");
  const navMap = Object.fromEntries(["bio", "discover", "edit", "store", "other"].map(id => [id, $(`a[href="#${id}"]`, nav)]));
  const secs = () => ["bio", "discover", "edit", "store", "other"].filter(id => !navMap[id].hidden);
  let activeId = "bio";
  function placeDock() {
    if (navMap[activeId].hidden) activeId = "bio";
    const a = navMap[activeId];
    ind.style.width = a.offsetWidth + "px"; ind.style.transform = `translateX(${a.offsetLeft}px)`; ind.classList.add("ready");
    Object.values(navMap).forEach(x => x.classList.toggle("on", x === a));
    const target = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: target, behavior: calm ? "auto" : "smooth" });
  }
  function onScroll() {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight, list = secs();
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    let id = "bio";
    list.forEach(s => { if ($("#" + s).getBoundingClientRect().top <= innerHeight * .38) id = s; });
    if (max > 0 && h.scrollTop >= max - 4) id = list[list.length - 1];
    if (id !== activeId) { activeId = id; placeDock(); }
  }
  let scrollTick = false;
  addEventListener("scroll", () => { if (scrollTick) return; scrollTick = true; requestAnimationFrame(() => { scrollTick = false; onScroll(); }); }, { passive: true });
  addEventListener("resize", () => { placeDock(); placeSeg(); });
  observeReveal($$("[data-reveal]"));

  /* ---------- pointer effects (desktop) ---------- */
  if (fine) {
    const cu = $("#cursor"), root = $("main"); let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, over = false;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; document.documentElement.style.setProperty("--mx", mx + "px"); document.documentElement.style.setProperty("--my", my + "px"); }, { passive: true });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cu.style.transform = `translate3d(${cx}px,${cy}px,0) scale(${over ? 1 : 0})`; cu.style.opacity = over ? 1 : 0; requestAnimationFrame(loop); })();
    root.addEventListener("mouseover", e => {
      const c = e.target.closest(".card"); over = !!c; if (c && c !== hov.card && !calm) startPreview(c);
    });
    root.addEventListener("mouseleave", () => { over = false; stopPreview(); });
    root.addEventListener("mouseout", e => {
      const c = e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) { c.style.transform = ""; if (hov.card === c) stopPreview(); }
    });
    root.addEventListener("mousemove", e => {
      const c = e.target.closest(".card"); if (!c || calm) return;
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--x", x + "px"); c.style.setProperty("--y", y + "px");
      c.style.transform = `rotateY(${((x / r.width) - .5) * 6}deg) rotateX(${(.5 - (y / r.height)) * 6}deg) translateZ(6px)`;
    });
  }

  /* =========================================================
     VIEWER VIDEO
     ========================================================= */
  const modal = $("#modal");
  const visibleIds = () => cards.filter(c => !c.hidden).map(c => c.dataset.id);
  const shareUrl = id => `${location.origin}${location.pathname}#/v/${id}`;
  function playVideo(v) {
    if (player && player.loadVideoById) { player.loadVideoById({ videoId: v.yt }); return; }
    loadAPI(() => { if (!player) player = new YT.Player("yt", { width: "100%", height: "100%", videoId: v.yt, playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: 1 }, events: { onReady: e => e.target.playVideo() } }); });
  }
  function fillModal() {
    const v = cur, ids = modal._ids || [], list = v.type === "other" ? OTV() : EDIT();
    $(".frame").style.setProperty("--r", ratioOf(v).toFixed(4));
    $("#m-no").textContent = pad(list.indexOf(v) + 1); $("#m-total").textContent = pad(list.length);
    $("#m-cat").textContent = v.category; $("#m-title").textContent = L(v.title);
    $("#m-desc").innerHTML = linkify(descOf(v)); $("#m-desc").hidden = !descOf(v);
    $("#m-meta").innerHTML = [[t("modal.client"), v.type === "client" ? v.client : ""], [t("modal.cat"), v.category], [t("modal.uploaded"), longDate(v.uploaded)], [t("modal.views"), v.views != null ? new Intl.NumberFormat(loc()).format(v.views) : ""], [t("modal.dur"), v.duration]]
      .filter(r => r[1]).map(([k, val]) => `<dt>${esc(k)}</dt><dd>${esc(val)}</dd>`).join("");
    $("#m-tools").innerHTML = (v.tools || []).map(x => `<span class="tag">${esc(x)}</span>`).join("");
    const ord = $("#m-order"); ord.hidden = v.type !== "client"; ord.href = contactUrl(t("msg.video").replace("{n}", L(v.title)));
    $("#m-yt").href = `https://www.youtube.com/watch?v=${v.yt}`;
    $("#prev").disabled = $("#next").disabled = ids.length < 2;
  }
  function open(id) {
    const v = byId[id]; if (!v) return; const first = !cur; cur = v; closeP(false); stopPreview();
    const vis = visibleIds(); modal._ids = v.type === "other" ? OTV().map(x => x.id) : vis.includes(id) ? vis : EDIT().map(x => x.id); modal._i = modal._ids.indexOf(id);
    fillModal(); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); lockBody();
    playVideo(v); if (first) setTimeout(() => $(".close", modal).focus({ preventScroll: true }), 60);
  }
  function closeV(updateHash = true) {
    if (!cur) return; cur = null;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); lockBody();
    try { player && player.pauseVideo(); } catch {}
    if (updateHash && /^#\/v\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#" + activeId);
  }
  const step = d => { const ids = modal._ids, nid = ids[(modal._i + d + ids.length) % ids.length]; location.replace("#/v/" + nid); };
  const route = () => {
    const v = location.hash.match(/^#\/v\/([\w-]+)/), p = location.hash.match(/^#\/([ps])\/([\w-]+)/);
    if (v && byId[v[1]]) {
      const x = byId[v[1]]; if (x.type !== "other" && x.type !== state.type) { state.type = x.type; state.cat = "all"; renderSeg(); renderFilters(); applyFilter(true); }
      open(v[1]);
    } else if (p && byItem[p[1] + "/" + p[2]]) openP(p[1] + "/" + p[2]);
    else { closeV(false); closeP(false); }
  };
  addEventListener("hashchange", route);
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeV(); });
  $("#prev").onclick = () => step(-1); $("#next").onclick = () => step(1);
  $("#m-copy").onclick = async () => { if (await copyText(shareUrl(cur.id))) toast(t("modal.copied")); };
  addEventListener("keydown", e => {
    if (cur) { if (e.key === "Escape") closeV(); if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); }
    else if (curP) { if (e.key === "Escape") closeP(); if (e.key === "ArrowLeft") goSlide(slideIdx - 1); if (e.key === "ArrowRight") goSlide(slideIdx + 1); }
  });

  /* ---------- judul otomatis kalau title dikosongkan ---------- */
  const setTitle = (v, title) => {
    v.title = title; $$(`.card[data-id="${CSS.escape(v.id)}"]`).forEach(c => { $("h3", c).textContent = title; $("img", c).alt = title; });
    if (v.discover) renderDiscover();
    if (cur && cur.id === v.id) fillModal();
  };
  ALL.filter(v => !v.title).forEach(v =>
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent("https://www.youtube.com/watch?v=" + v.yt)}&format=json`)
      .then(r => r.ok ? r.json() : Promise.reject()).then(j => setTitle(v, j.title)).catch(() => setTitle(v, "Video")));

  /* ---------- data otomatis (js/stats.json, diisi GitHub Action) ---------- */
  fetch("js/stats.json?" + Date.now()).then(r => r.ok ? r.json() : {}).then(st => {
    let changed = false;
    ALL.forEach(v => {
      const rs = parseRatio(st._ratio && st._ratio[v.yt]); if (rs) { v.ratioAuto = rs; changed = true; }
      const x = st[v.yt]; if (!x) return;
      if (x.views != null) v.views = x.views;
      if (!v.uploaded && x.uploaded) v.uploaded = x.uploaded;
      if (x.at) v.at = x.at;
      if (!v.duration && x.duration) v.duration = x.duration;
      if (!v.title && x.title) v.title = x.title;
      if (x.description) v.descAuto = x.description;
      changed = true;
    });
    if (st._roblox) { ext.roblox = st._roblox; changed = true; }
    if (st._sold) { ext.sold = st._sold; changed = true; }
    if (st._avora) { ext.avora = st._avora; changed = true; }
    if (!changed) return;
    sortAll(); renderBio(); if (statsDone) { statsDone = false; countUp(); }
    renderDiscover(); renderStore(); renderCards(); renderOther(); if (cur) fillModal(); if (curP) fillP();
  }).catch(() => {});

  /* ---------- boot ---------- */
  applyI18n(); renderCards(); onScroll(); route();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeDock(); placeSeg(); });
})();
