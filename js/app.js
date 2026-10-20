(() => {
  const S = window.SITE, D = window.I18N;
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

  /* ---------- state ---------- */
  let lang = store.get("lang") || (/^id\b/i.test(navigator.language || "") ? "id" : "en");
  if (!D[lang]) lang = "id";
  const state = { type: "client", cat: "all", tag: "all", order: "" };
  let cur = null, curP = null, player = null, apiState = 0, statsDone = false, ext = { roblox: {} };

  const t = k => D[lang][k] ?? k;
  const L = x => (x && typeof x === "object" ? (x[lang] ?? x.id ?? "") : x ?? "");
  const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;

  /* ---------- video data ---------- */
  const ytId = s => { s = String(s || "").trim(); const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m ? m[1] : s.slice(0, 11); };
  const seen = {};
  const ALL = window.VIDEOS.map(v => {
    const yt = ytId(v.yt); let id = v.id || yt; if (seen[id]) id += "-" + (++seen[id]); else seen[id] = 1;
    return { ...v, yt, id, type: v.type === "own" ? "own" : "client", category: v.category || "Video", client: v.client || "", views: v.views ?? null };
  });
  const sortAll = () => ALL.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.uploaded || "").localeCompare(a.uploaded || ""));
  sortAll();
  const byId = Object.fromEntries(ALL.map(v => [v.id, v]));
  const PR = window.PRODUCTS.map((p, i) => ({ ...p, id: p.id || "p" + (i + 1), images: p.images || [] }));
  const byP = Object.fromEntries(PR.map(p => [p.id, p]));

  /* ---------- helpers ---------- */
  const thumb = id => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const thumbLo = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const img = (id, alt = "") => {
    const i = new Image(); i.alt = alt; i.loading = "lazy"; i.decoding = "async"; i.src = thumb(id);
    const fb = () => { if (!i.dataset.fb) { i.dataset.fb = 1; i.src = thumbLo(id); } };
    i.addEventListener("error", fb); i.addEventListener("load", () => { if (i.naturalWidth <= 120) fb(); });
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
  if (S.logo) { $("#avatar").src = S.logo; $("#avatar").hidden = false; $$("link[rel=icon]").forEach(l => { l.href = S.logo; l.type = "image/png"; }); }
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
    videos: () => ({ n: ALL.length, suffix: "", label: t("stat.videos") }),
    clients: () => ({ n: new Set(ALL.map(v => v.client).filter(Boolean)).size, suffix: "", label: t("stat.clients") }),
    views: () => ({ n: ALL.reduce((a, v) => a + (v.views || 0), 0), suffix: "", compact: true, label: t("stat.views") }),
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

  /* ---------- EDIT ---------- */
  const grid = $("#grid"); let cards = [];
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
  function renderCards() {
    stopPreview(); grid.innerHTML = "";
    cards = ALL.map(v => {
      const a = document.createElement("a");
      a.className = "card glass"; a.href = `#/v/${v.id}`; a.dataset.id = v.id;
      a.innerHTML = `<div class="thumb"><span class="badge">${esc(v.category)}</span>${v.duration ? `<span class="dur">${esc(v.duration)}</span>` : ""}</div>
        <div class="card-body"><h3>${esc(L(v.title) || "…")}</h3><div class="card-meta">${[v.type === "client" ? v.client : "", v.views != null ? `${compact(v.views)} ${t("views")}` : "", ago(v.uploaded)].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("")}</div></div>`;
      $(".thumb", a).prepend(img(v.yt, L(v.title)));
      grid.append(a); return a;
    });
    applyFilter(true); observeReveal(cards.filter(c => !c.hidden), 6);
  }
  function applyFilter(instant) {
    const first = new Map(cards.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
    let n = 0;
    cards.forEach(c => { const v = byId[c.dataset.id]; c.hidden = v.type !== state.type || (state.cat !== "all" && v.category !== state.cat); if (!c.hidden) n++; });
    $("#empty").hidden = n > 0;
    $("#order").hidden = state.type !== "client";
    if (instant === true || calm) return;
    cards.forEach(c => {
      if (c.hidden) return; c.classList.remove("reveal", "in");
      const l = c.getBoundingClientRect(), p = first.get(c);
      if (p) { const dx = p.left - l.left, dy = p.top - l.top; if (dx || dy) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.2,.8,.2,1)" }); }
      else c.animate([{ opacity: 0, transform: "translateY(18px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 480, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }
  $("#seg").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.dataset.type === state.type) return;
    stopPreview(); state.type = b.dataset.type; state.cat = "all"; renderSeg(); renderFilters(); applyFilter();
  });
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.cat = b.dataset.v; $$(".chip", $("#filters")).forEach(c => c.classList.toggle("is-on", c === b)); applyFilter();
  });

  /* order panel (ringkas, animasi buka-tutup mulus) */
  function orderHtml(kind) {
    if (kind === "price") return `<div class="plans">${window.PRICING.map(p => `
        <div class="plan${p.popular ? " pop" : ""}">${p.popular ? `<span class="pop-tag">${esc(t("order.popular"))}</span>` : ""}
          <h4>${esc(L(p.name))}</h4><div class="price">${esc(p.price)}<small>${esc(L(p.unit))}</small></div>
          <p class="muted">${esc(L(p.desc))}</p>
          <ul>${p.features.map(f => `<li>${esc(L(f))}</li>`).join("")}</ul>
          <a class="btn btn-sm" href="${esc(contactUrl(t("msg.pkg").replace("{n}", L(p.name))))}" target="_blank" rel="noopener">${esc(t("order.pick"))}</a>
        </div>`).join("")}</div><p class="order-note">${esc(t("order.note"))}</p>`;
    if (kind === "steps") return `<ol class="steps">${[1, 2, 3, 4].map(i => `<li><b>0${i}</b><h4>${esc(t("step." + i + "t"))}</h4><p>${esc(t("step." + i + "d"))}</p></li>`).join("")}</ol>`;
    return window.FAQ.map(f => `<div class="qa"><button class="qa-q" aria-expanded="false">${esc(L(f.q))}</button><div class="qa-a"><div><p>${esc(L(f.a))}</p></div></div></div>`).join("");
  }
  function renderOrder() {
    $("#order-wa").href = contactUrl(t("msg.generic"));
    const body = $("#order-body"), inner = $("#order-inner");
    $$("#order-tabs button").forEach(b => b.classList.toggle("is-on", b.dataset.o === state.order));
    body.classList.toggle("open", !!state.order);
    if (state.order) inner.innerHTML = `<div class="oi">${orderHtml(state.order)}</div>`;
  }
  $("#order-tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.order = state.order === b.dataset.o ? "" : b.dataset.o; renderOrder(); });
  $("#order-inner").addEventListener("click", e => {
    const q = e.target.closest(".qa-q"); if (!q) return;
    const item = q.parentElement, open = !item.classList.contains("open");
    $$(".qa", $("#order-inner")).forEach(o => { o.classList.remove("open"); $(".qa-q", o).setAttribute("aria-expanded", "false"); });
    if (open) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
  });

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
    ? `<img src="${esc(p.images[0])}" alt="${esc(L(p.name))}" loading="lazy">`
    : ico("store");
  function renderStore() {
    const tags = [...new Set(PR.map(p => p.tag).filter(Boolean))];
    if (state.tag !== "all" && !tags.includes(state.tag)) state.tag = "all";
    $("#store-filters").innerHTML = tags.length > 1 ? [["all", t("store.all")], ...tags.map(x => [x, x])].map(([v, l]) => `<button class="chip${state.tag === v ? " is-on" : ""}" data-v="${esc(v)}">${esc(l)}</button>`).join("") : "";
    $("#products").innerHTML = PR.map(p => `
      <a class="product glass" href="#/p/${esc(p.id)}" data-tag="${esc(p.tag || "")}"${state.tag !== "all" && p.tag !== state.tag ? " hidden" : ""}>
        <div class="p-img">${pThumb(p)}${p.tag ? `<span class="badge">${esc(p.tag)}</span>` : ""}</div>
        <div class="p-body"><h3>${esc(L(p.name))}</h3><p>${esc(L(p.header))}</p>
          <div class="p-foot"><span class="p-price">${esc(p.price || "")}</span><span class="btn btn-sm">${esc(t("store.see"))}${ico("arrow")}</span></div></div>
      </a>`).join("");
    observeReveal($$(".product"), 6);
  }
  $("#store-filters").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.tag = b.dataset.v; $$(".chip", $("#store-filters")).forEach(c => c.classList.toggle("is-on", c === b));
    $$(".product").forEach(p => p.hidden = state.tag !== "all" && p.dataset.tag !== state.tag);
  });

  /* slider produk */
  const slides = $("#slides"), dots = $("#dots");
  let slideIdx = 0;
  function buildSlider(p) {
    slides.innerHTML = (p.images.length ? p.images : [""]).map(src => `<div class="slide">${src ? `<img src="${esc(src)}" alt="${esc(L(p.name))}" draggable="false">` : ico("store")}</div>`).join("");
    const n = slides.children.length;
    dots.innerHTML = n > 1 ? Array.from({ length: n }, (_, i) => `<button data-i="${i}" aria-label="Image ${i + 1}"></button>`).join("") : "";
    $("#s-prev").hidden = $("#s-next").hidden = n < 2;
    slideIdx = 0; slides.scrollLeft = 0; markDot();
  }
  const markDot = () => $$("button", dots).forEach((d, i) => d.classList.toggle("on", i === slideIdx));
  const goSlide = i => { const n = slides.children.length; slideIdx = (i + n) % n; slides.scrollTo({ left: slideIdx * slides.clientWidth, behavior: calm ? "auto" : "smooth" }); markDot(); };
  slides.addEventListener("scroll", () => { const i = Math.round(slides.scrollLeft / (slides.clientWidth || 1)); if (i !== slideIdx) { slideIdx = i; markDot(); } }, { passive: true });
  $("#s-prev").onclick = () => goSlide(slideIdx - 1); $("#s-next").onclick = () => goSlide(slideIdx + 1);
  dots.addEventListener("click", e => { const b = e.target.closest("button"); if (b) goSlide(+b.dataset.i); });

  /* modal produk */
  const pmodal = $("#pmodal");
  function fillP() {
    const p = curP, i = PR.indexOf(p);
    $("#p-no").textContent = pad(i + 1); $("#p-total").textContent = pad(PR.length);
    $("#p-tag").textContent = p.tag || ""; $("#p-tag").hidden = !p.tag;
    $("#p-title").textContent = L(p.name); $("#p-header").textContent = L(p.header); $("#p-header").hidden = !p.header;
    $("#p-price").textContent = p.price || ""; $("#p-desc").textContent = L(p.desc);
    const buy = $("#p-buy"); buy.href = p.url || "#"; buy.setAttribute("aria-disabled", p.url ? "false" : "true");
    $("#pprev").disabled = $("#pnext").disabled = PR.length < 2;
  }
  function openP(id) {
    const p = byP[id]; if (!p) return; const changed = curP !== p; curP = p; closeV(false); stopPreview();
    fillP(); if (changed) buildSlider(p);
    pmodal.classList.add("open"); pmodal.setAttribute("aria-hidden", "false"); lockBody();
  }
  function closeP(updateHash = true) {
    if (!curP) return; curP = null;
    pmodal.classList.remove("open"); pmodal.setAttribute("aria-hidden", "true"); lockBody();
    if (updateHash && /^#\/p\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#" + activeId);
  }
  const stepP = d => { const i = PR.indexOf(curP); location.replace("#/p/" + PR[(i + d + PR.length) % PR.length].id); };
  pmodal.addEventListener("click", e => { if (e.target.closest("[data-pclose]")) closeP(); });
  $("#pprev").onclick = () => stepP(-1); $("#pnext").onclick = () => stepP(1);

  /* ---------- OTHER ---------- */
  function renderOther() {
    $("#games").innerHTML = window.GAMES.map(g => {
      const r = (g.placeId && ext.roblox[g.placeId]) || {}, name = L(g.name) || r.name || "Game", image = g.image || r.image;
      return `<article class="game glass">
        <div class="g-img">${image ? `<img src="${esc(image)}" alt="${esc(name)}" loading="lazy" referrerpolicy="no-referrer">` : ico("roblox")}</div>
        <div class="g-body"><h3>${esc(name)}</h3><p>${esc(L(g.desc))}</p>
          ${r.playing != null || r.visits != null ? `<div class="g-stats">${r.playing != null ? `<span><b>${compact(r.playing)}</b> ${esc(t("game.playing"))}</span>` : ""}${r.visits != null ? `<span><b>${compact(r.visits)}</b> ${esc(t("game.visits"))}</span>` : ""}</div>` : ""}
          ${g.url ? `<a class="btn btn-sm" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">${esc(t("game.play"))}${ico("arrow")}</a>` : `<span class="btn btn-sm btn-ghost" aria-disabled="true">${esc(t("game.soon"))}</span>`}</div>
      </article>`;
    }).join("");
    $("#olinks").innerHTML = window.OTHER_LINKS.filter(l => l.url).map(l => linkEl(l, false)).join("");
    $("#olinks-h").hidden = !$("#olinks .link");
    observeReveal([...$$(".game"), ...$$("#olinks .link")], 6);
  }

  /* ---------- i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => el.innerHTML = t(el.dataset.i18n));
    document.title = `${S.name} — ${L(S.role)}`;
    $("#lang").dataset.l = lang; $$("#lang button").forEach(b => b.classList.toggle("is-on", b.dataset.lang === lang));
    renderBio(); if (statsDone) { statsDone = false; countUp(); }
    renderSeg(); renderFilters(); renderOrder(); renderStore(); renderOther();
    if (cur) fillModal(); if (curP) fillP();
    requestAnimationFrame(() => { placeSeg(); placeDock(); });
  }
  $("#lang").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set("lang", lang); applyI18n(); renderCards();
  });

  /* ---------- dock: scroll-spy + indikator ---------- */
  const secs = ["bio", "edit", "store", "other"], navLinks = $$("#nav a"), ind = $("#ind"), nav = $("#nav"), bar = $("#progress");
  let activeId = "bio";
  function placeDock() {
    const a = navLinks[secs.indexOf(activeId)]; if (!a) return;
    ind.style.width = a.offsetWidth + "px"; ind.style.transform = `translateX(${a.offsetLeft}px)`; ind.classList.add("ready");
    navLinks.forEach(x => x.classList.toggle("on", x === a));
    const target = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: target, behavior: calm ? "auto" : "smooth" });
  }
  function onScroll() {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    let id = "bio";
    secs.forEach(s => { if ($("#" + s).getBoundingClientRect().top <= innerHeight * .38) id = s; });
    if (max > 0 && h.scrollTop >= max - 4) id = "other";
    if (id !== activeId) { activeId = id; placeDock(); }
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { placeDock(); placeSeg(); });
  observeReveal($$("[data-reveal]"));

  /* ---------- pointer effects (desktop) ---------- */
  if (fine) {
    const cu = $("#cursor"); let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, over = false;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; document.documentElement.style.setProperty("--mx", mx + "px"); document.documentElement.style.setProperty("--my", my + "px"); }, { passive: true });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cu.style.transform = `translate3d(${cx}px,${cy}px,0) scale(${over ? 1 : 0})`; cu.style.opacity = over ? 1 : 0; requestAnimationFrame(loop); })();
    grid.addEventListener("mouseover", e => {
      const c = e.target.closest(".card"); over = !!c; if (c && c !== hov.card && !calm) startPreview(c);
    });
    grid.addEventListener("mouseleave", () => { over = false; stopPreview(); });
    grid.addEventListener("mouseout", e => {
      const c = e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) { c.style.transform = ""; if (hov.card === c) stopPreview(); }
    });
    grid.addEventListener("mousemove", e => {
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
    const v = cur, ids = modal._ids || [];
    $("#m-no").textContent = pad(ALL.indexOf(v) + 1); $("#m-total").textContent = pad(ALL.length);
    $("#m-cat").textContent = v.category; $("#m-title").textContent = L(v.title);
    $("#m-desc").textContent = L(v.desc) || ""; $("#m-desc").hidden = !v.desc;
    $("#m-meta").innerHTML = [[t("modal.client"), v.type === "client" ? v.client : ""], [t("modal.cat"), v.category], [t("modal.uploaded"), longDate(v.uploaded)], [t("modal.views"), v.views != null ? new Intl.NumberFormat(loc()).format(v.views) : ""], [t("modal.dur"), v.duration]]
      .filter(r => r[1]).map(([k, val]) => `<dt>${esc(k)}</dt><dd>${esc(val)}</dd>`).join("");
    $("#m-tools").innerHTML = (v.tools || []).map(x => `<span class="tag">${esc(x)}</span>`).join("");
    const ord = $("#m-order"); ord.hidden = v.type !== "client"; ord.href = contactUrl(t("msg.video").replace("{n}", L(v.title)));
    $("#m-yt").href = `https://www.youtube.com/watch?v=${v.yt}`;
    $("#prev").disabled = $("#next").disabled = ids.length < 2;
  }
  function open(id) {
    const v = byId[id]; if (!v) return; const first = !cur; cur = v; closeP(false); stopPreview();
    const vis = visibleIds(); modal._ids = vis.includes(id) ? vis : ALL.map(x => x.id); modal._i = modal._ids.indexOf(id);
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
    const v = location.hash.match(/^#\/v\/([\w-]+)/), p = location.hash.match(/^#\/p\/([\w-]+)/);
    if (v && byId[v[1]]) {
      const x = byId[v[1]]; if (x.type !== state.type) { state.type = x.type; state.cat = "all"; renderSeg(); renderFilters(); applyFilter(true); }
      open(v[1]);
    } else if (p && byP[p[1]]) openP(p[1]);
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
    v.title = title; const c = cards.find(c => c.dataset.id === v.id);
    if (c) { $("h3", c).textContent = title; $("img", c).alt = title; }
    if (cur && cur.id === v.id) fillModal();
  };
  ALL.filter(v => !v.title).forEach(v =>
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent("https://www.youtube.com/watch?v=" + v.yt)}&format=json`)
      .then(r => r.ok ? r.json() : Promise.reject()).then(j => setTitle(v, j.title)).catch(() => setTitle(v, "Video")));

  /* ---------- data otomatis (js/stats.json, diisi GitHub Action) ---------- */
  fetch("js/stats.json?" + Date.now()).then(r => r.ok ? r.json() : {}).then(st => {
    let changed = false;
    ALL.forEach(v => {
      const x = st[v.yt]; if (!x) return;
      if (x.views != null) v.views = x.views;
      if (!v.uploaded && x.uploaded) v.uploaded = x.uploaded;
      if (!v.duration && x.duration) v.duration = x.duration;
      if (!v.title && x.title) v.title = x.title;
      changed = true;
    });
    if (st._roblox) { ext.roblox = st._roblox; changed = true; }
    if (!changed) return;
    sortAll(); renderBio(); if (statsDone) { statsDone = false; countUp(); }
    renderCards(); renderOther(); if (cur) fillModal();
  }).catch(() => {});

  /* ---------- boot ---------- */
  applyI18n(); renderCards(); onScroll(); route();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeDock(); placeSeg(); });
})();
