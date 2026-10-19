(() => {
  const S = window.SITE, D = window.I18N;
  /* yt boleh ID atau link penuh (watch?v=, youtu.be/, shorts/, embed/) */
  const ytId = s => { s = String(s || "").trim(); const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m ? m[1] : s.slice(0, 11); };
  const seen = {};
  const ALL = window.VIDEOS.map(v => {
    const yt = ytId(v.yt); let id = v.id || yt; if (seen[id]) id += "-" + (++seen[id]); else seen[id] = 1;
    return { ...v, yt, id, category: v.category || "Video", client: v.client || "", views: v.views ?? null, year: v.uploaded ? +v.uploaded.slice(0, 4) : v.year };
  }).sort((a, b) => (b.uploaded || "").localeCompare(a.uploaded || ""));
  const REEL = { id: "reel", yt: ytId(S.showreel), title: "Showreel", client: S.name, category: "Showreel", tools: S.tools };
  const byId = Object.fromEntries([...ALL, REEL].map(v => [v.id, v]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, "0");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ---------- language ---------- */
  let lang = store.get("lang") || (/^id\b/i.test(navigator.language || "") ? "id" : "en");
  if (!D[lang]) lang = "id";
  const t = k => D[lang][k] ?? k;
  const L = x => (x && typeof x === "object" ? (x[lang] ?? x.id ?? "") : x ?? "");

  /* ---------- helpers ---------- */
  const thumb = id => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const thumbLo = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const img = (id, alt = "") => {
    const i = new Image(); i.alt = alt; i.loading = "lazy"; i.decoding = "async"; i.src = thumb(id);
    const fb = () => { if (!i.dataset.fb) { i.dataset.fb = 1; i.src = thumbLo(id); } };
    i.addEventListener("error", fb);
    i.addEventListener("load", () => { if (i.naturalWidth <= 120) fb(); });
    return i;
  };
  const loc = () => (lang === "id" ? "id-ID" : "en-US");
  const compact = n => new Intl.NumberFormat(loc(), { notation: "compact", maximumFractionDigits: 1 }).format(n);
  const ago = d => {
    if (!d) return "";
    const days = Math.round((new Date(d) - Date.now()) / 864e5), rtf = new Intl.RelativeTimeFormat(loc(), { numeric: "auto" });
    const a = Math.abs(days);
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

  /* ---------- static bits (not language dependent) ---------- */
  $("#brand").innerHTML = S.logo ? `<img class="logo" src="${esc(S.logo)}" alt=""><span>${esc(S.name)}</span>` : `<i class="mark"></i><span>${esc(S.name)}</span>`;
  if (S.logo) { $("#avatar").src = S.logo; $("#avatar").hidden = false; $$("link[rel=icon]").forEach(l => { l.href = S.logo; l.type = "image/png"; }); }
  $$("[data-site]").forEach(el => el.textContent = S[el.dataset.site] ?? "");
  $("#year").textContent = new Date().getFullYear();
  $("#foot-mail").href = `mailto:${S.email}`;
  $("#tools").innerHTML = (S.tools || []).map(x => `<span class="tag">${esc(x)}</span>`).join("");
  $("#socials").innerHTML = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["youtube", "YouTube"]]
    .filter(([k]) => S[k]).map(([k, n]) => `<a href="${esc(S[k])}" target="_blank" rel="noopener">${n}</a>`).join("");
  $("#reel-img").src = thumb(REEL.yt); $("#reel-img").addEventListener("error", e => e.target.src = thumbLo(REEL.yt));

  /* hero reel: muted looping background (lazy, after load) */
  if (!calm && REEL.yt) addEventListener("load", () => setTimeout(() => {
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${REEL.yt}?autoplay=1&mute=1&loop=1&playlist=${REEL.yt}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3`;
    f.allow = "autoplay; encrypted-media"; f.title = "Showreel"; f.tabIndex = -1; f.setAttribute("aria-hidden", "true");
    f.addEventListener("load", () => setTimeout(() => f.classList.add("on"), 1200));
    $("#reel-frame").append(f);
  }, 600));

  /* marquee: categories + a few service words */
  const cats = [...new Set(ALL.map(v => v.category))];
  const mq = cats.map(c => `<span>${esc(c)}</span>`).join("");
  let reps = mq; while (reps.length < 700) reps += mq;
  $("#marquee").innerHTML = reps + reps;

  /* ---------- render: language dependent ---------- */
  const autoStat = {
    videos: () => ({ n: ALL.length, suffix: "", label: t("stat.videos") }),
    clients: () => ({ n: new Set(ALL.map(v => v.client).filter(Boolean)).size, suffix: "", label: t("stat.clients") }),
    views: () => ({ n: ALL.reduce((a, v) => a + (v.views || 0), 0), suffix: "", compact: true, label: t("stat.views") }),
  };
  const statVal = (n, sfx, c) => (c ? compact(n) : n + sfx);
  function renderStats() {
    $("#stats").innerHTML = S.stats.map(s => {
      const r = s.auto && autoStat[s.auto] ? autoStat[s.auto]() : { n: s.n, suffix: s.suffix || "", compact: false, label: L(s.label) };
      return `<li><strong data-n="${r.n}" data-s="${esc(r.suffix)}" data-c="${r.compact ? 1 : 0}">${statVal(r.n, r.suffix, r.compact)}</strong><span>${esc(r.label)}</span></li>`;
    }).join("");
  }
  let statsDone = false;
  function countUp() {
    if (statsDone) return; statsDone = true;
    $$("#stats strong").forEach(el => {
      const n = +el.dataset.n, sfx = el.dataset.s, c = el.dataset.c === "1", t0 = performance.now(), dur = 1700;
      const step = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = statVal(Math.round(n * e), sfx, c); if (p < 1) requestAnimationFrame(step); };
      if (calm) el.textContent = statVal(n, sfx, c); else requestAnimationFrame(step);
    });
  }

  const filt = { cat: "all" };
  function renderFilters() {
    const items = [["all", t("works.all")], ...cats.map(c => [c, c])];
    $("#filters").innerHTML = items.map(([v, l]) => `<button class="chip${filt.cat === v ? " is-on" : ""}" data-v="${esc(v)}">${esc(l)}</button>`).join("");
  }
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    filt.cat = b.dataset.v; $$(".chip", $("#filters")).forEach(c => c.classList.toggle("is-on", c === b)); applyFilter();
  });

  const grid = $("#grid"); let cards = [];
  function renderCards() {
    grid.innerHTML = ""; const wideId = (ALL.find(v => v.featured) || {}).id;
    cards = ALL.map((v, i) => {
      const a = document.createElement("a");
      a.className = "card glass" + (v.id === wideId ? " wide" : ""); a.href = `#/v/${v.id}`; a.dataset.id = v.id;
      a.innerHTML = `<div class="thumb"><span class="badge">${esc(v.category)}</span>${v.duration ? `<span class="dur">${esc(v.duration)}</span>` : ""}</div>
        <div class="card-body"><h3>${esc(L(v.title) || "…")}</h3><div class="card-meta">${[v.client, v.views != null ? `${compact(v.views)} ${t("views")}` : "", ago(v.uploaded)].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("")}</div></div>`;
      $(".thumb", a).prepend(img(v.yt, L(v.title)));
      grid.append(a); return a;
    });
    applyFilter(true);
    observeReveal(cards, 5);
  }
  function applyFilter(instant) {
    const first = new Map(cards.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
    let n = 0;
    cards.forEach(c => { c.hidden = filt.cat !== "all" && byId[c.dataset.id].category !== filt.cat; if (!c.hidden) n++; c.classList.toggle("wide", filt.cat === "all" && c.dataset.id === (ALL.find(v => v.featured) || {}).id); });
    $("#empty").hidden = n > 0;
    if (instant === true || calm) return;
    cards.forEach(c => {
      if (c.hidden) return;
      c.classList.remove("reveal", "in");
      const l = c.getBoundingClientRect(), p = first.get(c);
      if (p) { const dx = p.left - l.left, dy = p.top - l.top; if (dx || dy) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" }); }
      else c.animate([{ opacity: 0, transform: "translateY(20px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }

  function renderPlans() {
    $("#plans").innerHTML = window.PRICING.map((p, i) => `
      <article class="plan glass reveal${p.popular ? " pop" : ""}" style="--i:${i}">
        ${p.popular ? `<span class="pop-tag">${esc(t("pricing.popular"))}</span>` : ""}
        <h3>${esc(L(p.name))}</h3>
        <div class="price">${esc(p.price)}<small>${esc(L(p.unit))}</small></div>
        <p class="muted">${esc(L(p.desc))}</p>
        <ul>${p.features.map(f => `<li>${esc(L(f))}</li>`).join("")}</ul>
        <a class="btn" href="${esc(contactUrl(t("msg.pkg").replace("{n}", L(p.name))))}" target="_blank" rel="noopener">${esc(t("pricing.pick"))}</a>
      </article>`).join("");
    observeReveal($$(".plan"));
  }
  function renderFaq() {
    $("#faq").innerHTML = window.FAQ.map(f => `<details class="qa"><summary>${esc(L(f.q))}</summary><p>${esc(L(f.a))}</p></details>`).join("");
    $$(".qa").forEach(d => d.addEventListener("toggle", () => { if (d.open) $$(".qa").forEach(o => o !== d && (o.open = false)); }));
  }

  function applyI18n(replay) {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => el.innerHTML = t(el.dataset.i18n));
    $("#about-text").textContent = L(S.about);
    document.title = `${S.name} — ${L(S.role)}`;
    $("#lang").dataset.l = lang; $$("#lang button").forEach(b => b.classList.toggle("is-on", b.dataset.lang === lang));
    const wa = contactUrl(t("msg.generic"));
    $("#hero-wa").href = wa; $("#foot-wa").href = wa; $("#mega").href = wa;
    $("#top-cta").href = "#contact";
    renderStats(); if (statsDone) { statsDone = false; countUp(); }
    renderFilters(); renderPlans(); renderFaq(); if (cur) fillModal();
    if (replay && !calm) $$(".display .ln>span").forEach((s, i) => { s.style.animation = "none"; void s.offsetWidth; s.style.animation = ""; s.style.animationDelay = i * .1 + "s"; });
  }
  $("#lang").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set("lang", lang); applyI18n(true); renderCards();
  });

  /* ---------- reveal / progress / spy ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add("in");
    setTimeout(() => el.classList.remove("reveal", "in"), 1600);
  }), { threshold: .1, rootMargin: "0px 0px -5% 0px" });
  function observeReveal(els, mod) { els.forEach((el, i) => { el.classList.add("reveal"); if (mod) el.style.setProperty("--i", i % mod); io.observe(el); }); }
  observeReveal($$("[data-reveal]"));
  const statsIO = new IntersectionObserver(es => { if (es[0].isIntersecting) { countUp(); statsIO.disconnect(); } }, { threshold: .4 });
  statsIO.observe($("#stats"));

  const bar = $("#progress"), secs = ["works", "pricing", "process", "contact"].map(id => $("#" + id));
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    const y = innerHeight * .4; let on = "";
    secs.forEach(s => { if (s.getBoundingClientRect().top < y) on = s.id; });
    $$("#nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + on));
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- pointer effects ---------- */
  if (fine) {
    const cur = $("#cursor"); let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, over = false;
    addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      document.documentElement.style.setProperty("--mx", mx + "px"); document.documentElement.style.setProperty("--my", my + "px");
    }, { passive: true });
    (function loop() {
      cx += (mx - cx) * .2; cy += (my - cy) * .2;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0) scale(${over ? 1 : 0})`; cur.style.opacity = over ? 1 : 0;
      requestAnimationFrame(loop);
    })();
    grid.addEventListener("mouseover", e => { over = !!e.target.closest(".card"); });
    grid.addEventListener("mouseleave", () => over = false);
    grid.addEventListener("mousemove", e => {
      const c = e.target.closest(".card"); if (!c || calm) return;
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--x", x + "px"); c.style.setProperty("--y", y + "px");
      c.style.transform = `rotateY(${((x / r.width) - .5) * 7}deg) rotateX(${(.5 - (y / r.height)) * 7}deg) translateZ(6px)`;
    });
    grid.addEventListener("mouseout", e => { const c = e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) c.style.transform = ""; });
    $$("[data-magnetic]").forEach(el => {
      el.addEventListener("mousemove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
    const reel = $("#reel");
    reel.addEventListener("mousemove", e => { if (calm) return; const r = reel.getBoundingClientRect(); reel.style.transform = `perspective(1000px) rotateY(${((e.clientX - r.left) / r.width - .5) * 8}deg) rotateX(${(.5 - (e.clientY - r.top) / r.height) * 8}deg)`; });
    reel.addEventListener("mouseleave", () => reel.style.transform = "");
  }

  /* =========================================================
     VIEWER
     ========================================================= */
  const modal = $("#modal"); let cur = null, player = null, apiState = 0;
  const visibleIds = () => cards.filter(c => !c.hidden).map(c => c.dataset.id);
  const shareUrl = id => `${location.origin}${location.pathname}#/v/${id}`;

  function loadAPI(cb) {
    if (window.YT && YT.Player) return cb();
    if (!apiState) { apiState = 1; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.append(s); }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev && prev(); cb(); };
  }
  function playVideo(v) {
    if (player && player.loadVideoById) { player.loadVideoById({ videoId: v.yt }); return; }
    loadAPI(() => { if (!player) player = new YT.Player("yt", { width: "100%", height: "100%", videoId: v.yt, playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: 1 }, events: { onReady: e => e.target.playVideo() } }); });
  }
  function fillModal() {
    const v = cur, isReel = v.id === "reel", ids = modal._ids || [];
    $("#m-no").textContent = isReel ? "★" : pad(ALL.indexOf(v) + 1); $("#m-total").textContent = pad(ALL.length);
    $("#m-cat").textContent = v.category; $("#m-title").textContent = L(v.title);
    $("#m-desc").textContent = L(v.desc) || ""; $("#m-desc").hidden = !v.desc;
    $("#m-meta").innerHTML = isReel ? "" : [[t("modal.client"), v.client], [t("modal.cat"), v.category], [t("modal.uploaded"), longDate(v.uploaded)], [t("modal.views"), v.views != null ? new Intl.NumberFormat(loc()).format(v.views) : ""], [t("modal.dur"), v.duration]]
      .filter(r => r[1]).map(([k, val]) => `<dt>${esc(k)}</dt><dd>${esc(val)}</dd>`).join("");
    $("#m-meta").hidden = isReel;
    $("#m-tools").innerHTML = (v.tools || []).map(x => `<span class="tag">${esc(x)}</span>`).join("");
    $("#m-order").href = contactUrl(isReel ? t("msg.generic") : t("msg.video").replace("{n}", L(v.title)));
    $("#prev").disabled = $("#next").disabled = isReel || ids.length < 2;
  }
  function open(id) {
    const v = byId[id]; if (!v) return; const first = !cur; cur = v;
    const vis = visibleIds(); modal._ids = vis.includes(id) ? vis : ALL.map(x => x.id); modal._i = modal._ids.indexOf(id);
    fillModal(); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("lock");
    playVideo(v); if (first) setTimeout(() => $(".close", modal).focus({ preventScroll: true }), 60);
  }
  function close(updateHash = true) {
    if (!cur) return; cur = null;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock");
    try { player && player.pauseVideo(); } catch {}
    if (updateHash && /^#\/v\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#/");
  }
  const step = d => { const ids = modal._ids; location.replace("#/v/" + ids[(modal._i + d + ids.length) % ids.length]); };
  const route = () => { const m = location.hash.match(/^#\/v\/([\w-]+)/); if (m && byId[m[1]]) open(m[1]); else close(false); };
  addEventListener("hashchange", route);
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) close(); });
  $("#prev").onclick = () => step(-1); $("#next").onclick = () => step(1);
  $("#reel-play").onclick = () => { location.hash = "#/v/reel"; };
  $("#m-copy").onclick = async () => { try { await navigator.clipboard.writeText(shareUrl(cur.id)); toast(t("modal.copied")); } catch { prompt("Link:", shareUrl(cur.id)); } };
  addEventListener("keydown", e => {
    if (!cur) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- judul otomatis dari YouTube kalau title dikosongkan di data.js ---------- */
  const setTitle = (v, title) => {
    v.title = title; const c = cards.find(c => c.dataset.id === v.id);
    if (c) { $("h3", c).textContent = title; $("img", c).alt = title; }
    if (cur && cur.id === v.id) fillModal();
  };
  ALL.filter(v => !v.title).forEach(v =>
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent("https://www.youtube.com/watch?v=" + v.yt)}&format=json`)
      .then(r => r.ok ? r.json() : Promise.reject()).then(j => setTitle(v, j.title)).catch(() => setTitle(v, "Video")));

  /* ---------- stats otomatis dari YouTube (js/stats.json, diisi GitHub Action) ---------- */
  fetch("js/stats.json?" + Date.now()).then(r => r.ok ? r.json() : {}).then(st => {
    let changed = false;
    [...ALL, REEL].forEach(v => {
      const x = st[v.yt]; if (!x) return;
      if (x.views != null) v.views = x.views;
      if (!v.uploaded && x.uploaded) v.uploaded = x.uploaded;
      if (!v.duration && x.duration) v.duration = x.duration;
      if (!v.title && x.title) v.title = x.title;
      changed = true;
    });
    if (!changed) return;
    ALL.sort((a, b) => (b.uploaded || "").localeCompare(a.uploaded || ""));
    renderStats(); if (statsDone) { statsDone = false; countUp(); }
    renderCards(); if (cur) fillModal();
  }).catch(() => {});

  /* ---------- boot ---------- */
  applyI18n(false); renderCards(); onScroll(); route();
})();
