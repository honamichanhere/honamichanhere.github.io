(() => {
  const S = window.SITE, ALL = [...window.VIDEOS].sort((a, b) => b.date.localeCompare(a.date));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, "0");
  const fmt = s => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? pad(h) + ":" : "") + pad(m) + ":" + pad(s % 60); };
  const STATUS = { approved: "Approved", review: "In review", revisi: "Revisi" };
  const thumb = id => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const thumbLo = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const byId = Object.fromEntries(ALL.map(v => [v.id, v]));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  /* thumbnails: maxres kadang ga ada -> fallback */
  const img = (id, alt = "") => {
    const i = new Image(); i.alt = alt; i.loading = "lazy"; i.decoding = "async"; i.src = thumb(id);
    i.addEventListener("error", () => { if (!i.dataset.fb) { i.dataset.fb = 1; i.src = thumbLo(id); } });
    i.addEventListener("load", () => { if (i.naturalWidth <= 120 && !i.dataset.fb) { i.dataset.fb = 1; i.src = thumbLo(id); } });
    return i;
  };

  /* ---------- site text ---------- */
  $$("[data-site]").forEach(el => el.textContent = S[el.dataset.site] ?? "");
  document.title = `Review Room — ${S.name}`;
  const links = [];
  if (S.email) links.push(`<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>`);
  if (S.whatsapp) links.push(`<a href="https://wa.me/${esc(S.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (S.instagram) links.push(`<a href="${esc(S.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  $("#foot-links").innerHTML = links.join("");
  $("#mega").href = S.whatsapp ? `https://wa.me/${S.whatsapp}` : S.email ? `mailto:${S.email}` : "#contact";
  const countStr = pad(ALL.length);
  ["nav-count", "index-count"].forEach(id => $("#" + id).textContent = countStr);

  /* ---------- hero timecode ---------- */
  const tc = $("#tc"), t0 = performance.now();
  (function tick(now) {
    const f = Math.floor((now - t0) / (1000 / 24)), s = Math.floor(f / 24);
    tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`;
    requestAnimationFrame(tick);
  })(t0);

  /* ---------- marquee ---------- */
  const clients = [...new Set(ALL.map(v => v.client))];
  const mq = clients.map(c => `<span>${esc(c)}</span>`).join("");
  let reps = mq; while (reps.length < 600) reps += mq;
  $("#marquee").innerHTML = reps + reps;

  /* ---------- featured (hero) ---------- */
  const feat = ALL.filter(v => v.featured).slice(0, 5); if (!feat.length) feat.push(...ALL.slice(0, 3));
  const stack = $("#featured-stack"), fImgs = feat.map((v, i) => { const im = img(v.yt, v.title); im.loading = "eager"; if (!i) im.classList.add("on"); stack.append(im); return im; });
  let fi = 0;
  const setFeat = i => {
    fi = i; fImgs.forEach((im, k) => im.classList.toggle("on", k === i));
    $("#featured-title").textContent = feat[i].title;
    $("#featured-count").textContent = `${pad(i + 1)}/${pad(feat.length)}`;
    $("#featured").href = `#/v/${feat[i].id}`;
  };
  setFeat(0);
  if (feat.length > 1 && !calm) setInterval(() => setFeat((fi + 1) % feat.length), 4200);

  /* ---------- cards ---------- */
  const grid = $("#grid");
  const cards = ALL.map((v, i) => {
    const a = document.createElement("a");
    a.className = "card reveal"; a.href = `#/v/${v.id}`; a.dataset.id = v.id; a.style.setProperty("--i", i % 6);
    a.dataset.search = `${v.title} ${v.client} ${v.category}`.toLowerCase();
    a.innerHTML = `
      <div class="thumb"><span class="dur"></span></div>
      <div class="meta">
        <span class="no mono">${pad(i + 1)}</span>
        <h3 class="title">${esc(v.title)}</h3>
        <span class="sub"><span class="client">${esc(v.client)}</span><span class="cat">${esc(v.category)}</span></span>
        <span class="status" data-s="${v.status}">${STATUS[v.status] || v.status}</span>
        <span class="date mono">${new Date(v.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
      </div>`;
    $(".thumb", a).prepend(img(v.yt, v.title));
    $(".dur", a).textContent = v.duration || "";
    if (!v.duration) $(".dur", a).remove();
    grid.append(a);
    return a;
  });

  /* ---------- filters (FLIP) ---------- */
  const f = { q: "", client: "all", status: "all" };
  const mkChips = (el, items, key) => {
    el.innerHTML = items.map(([val, label]) => `<button class="chip${val === "all" ? " is-on" : ""}" data-v="${esc(val)}">${esc(label)}</button>`).join("");
    el.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", el).forEach(c => c.classList.toggle("is-on", c === b));
      f[key] = b.dataset.v; applyFilter();
    });
  };
  mkChips($("#chips-client"), [["all", "Semua client"], ...clients.map(c => [c, c])], "client");
  const stUsed = [...new Set(ALL.map(v => v.status))];
  mkChips($("#chips-status"), [["all", "Semua status"], ...stUsed.map(s => [s, STATUS[s] || s])], "status");
  $("#q").addEventListener("input", e => { f.q = e.target.value.trim().toLowerCase(); applyFilter(); });

  const match = c => {
    const v = byId[c.dataset.id];
    return (!f.q || c.dataset.search.includes(f.q)) && (f.client === "all" || v.client === f.client) && (f.status === "all" || v.status === f.status);
  };
  function applyFilter() {
    const first = new Map(cards.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
    let n = 0;
    cards.forEach(c => { c.hidden = !match(c); if (!c.hidden) { n++; c.classList.remove("reveal", "in"); } });
    cards.forEach(c => {
      if (c.hidden || calm) return;
      const l = c.getBoundingClientRect(), p = first.get(c);
      if (p) {
        const dx = p.left - l.left, dy = p.top - l.top;
        if (dx || dy) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.2,.8,.2,1)" });
      } else c.animate([{ opacity: 0, transform: "translateY(18px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 480, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
    $("#empty").hidden = n > 0;
  }

  /* view toggle */
  $$(".view button").forEach(b => b.addEventListener("click", () => {
    $$(".view button").forEach(x => x.classList.toggle("is-on", x === b));
    const first = new Map(cards.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
    grid.classList.toggle("is-list", b.dataset.view === "list");
    cards.forEach(c => {
      if (c.hidden || calm) return;
      const l = c.getBoundingClientRect(), p = first.get(c);
      c.animate([{ transform: `translateY(${p.top - l.top}px)`, opacity: .3 }, { transform: "none", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }));

  /* ---------- scroll reveal / progress / header ---------- */
  $$("[data-reveal]").forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add("in");
    setTimeout(() => el.classList.remove("reveal", "in"), 1500);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const bar = $("#progress"), top = $("#top");
  const onScroll = () => {
    const h = document.documentElement; const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    top.classList.toggle("scrolled", h.scrollTop > 40);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- cursor, peek, magnetic, parallax ---------- */
  if (fine) {
    const cur = $("#cursor"), peek = $("#peek"), pimg = $("img", peek);
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, px = mx, py = my;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      cx += (mx - cx) * .2; cy += (my - cy) * .2; px += (mx - px) * .12; py += (my - py) * .12;
      const on = cur.classList.contains("on");
      cur.style.transform = `translate3d(${cx}px,${cy}px,0) scale(${on ? 1 : 0})`;
      peek.style.transform = `translate3d(${px + 28}px,${py - 90}px,0) rotate(${(mx - px) * .03}deg)`;
      requestAnimationFrame(loop);
    })();
    grid.addEventListener("mouseover", e => {
      const c = e.target.closest(".card"); if (!c) return;
      const list = grid.classList.contains("is-list");
      cur.style.opacity = list ? 0 : 1; cur.classList.toggle("on", !list);
      peek.classList.toggle("on", list);
      if (list) pimg.src = thumbLo(byId[c.dataset.id].yt);
    });
    grid.addEventListener("mouseleave", () => { cur.classList.remove("on"); peek.classList.remove("on"); });
    $$("[data-magnetic]").forEach(el => {
      el.addEventListener("mousemove", e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
    const ft = $("#featured");
    addEventListener("mousemove", e => {
      if (calm) return;
      ft.style.transform = `translate(${(e.clientX / innerWidth - .5) * -14}px,${(e.clientY / innerHeight - .5) * -10}px)`;
    }, { passive: true });
  }

  /* ---------- toast ---------- */
  let tt; const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); };
  const copy = async txt => { try { await navigator.clipboard.writeText(txt); toast("Tersalin ✓"); } catch { prompt("Copy manual:", txt); } };

  /* =========================================================
     VIEWER
     ========================================================= */
  const modal = $("#modal"), noteList = $("#note-list"), noteText = $("#note-text");
  let cur = null, player = null, apiState = 0, locked = false, stampT = 0, clock;

  const visibleIds = () => cards.filter(c => !c.hidden).map(c => c.dataset.id);
  const notesKey = id => "rr-notes:" + id;
  const getNotes = id => store.get(notesKey(id), []);
  const shareUrl = (id, t) => `${location.origin}${location.pathname}#/v/${id}${t ? "?t=" + Math.floor(t) : ""}`;

  function loadAPI(cb) {
    if (window.YT && YT.Player) return cb();
    if (apiState === 0) { apiState = 1; const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.append(s); }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev && prev(); cb(); };
  }
  function playVideo(v, t) {
    if (player && player.loadVideoById) { player.loadVideoById({ videoId: v.yt, startSeconds: t || 0 }); return; }
    loadAPI(() => {
      if (player) return;
      player = new YT.Player("yt", {
        width: "100%", height: "100%", videoId: v.yt,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, start: t || 0, autoplay: 1 },
        events: { onReady: e => e.target.playVideo() },
      });
    });
  }
  const now = () => (player && player.getCurrentTime ? player.getCurrentTime() : 0);

  function renderNotes() {
    const ns = getNotes(cur.id).sort((a, b) => a.t - b.t);
    $("#notes-count").textContent = ns.length ? `${ns.length} catatan` : "";
    noteList.innerHTML = ns.length ? "" : `<li class="note-empty">Belum ada catatan. Pause di bagian yang mau direvisi, lalu tulis di atas.</li>`;
    ns.forEach(n => {
      const li = document.createElement("li");
      li.innerHTML = `<button class="t" title="Loncat ke sini">${fmt(n.t)}</button><p>${esc(n.text)}</p><button class="x" aria-label="Hapus">×</button>`;
      $(".t", li).onclick = () => { player && player.seekTo(n.t, true); player && player.playVideo(); };
      $(".x", li).onclick = () => { store.set(notesKey(cur.id), getNotes(cur.id).filter(x => x.at !== n.at)); renderNotes(); };
      noteList.append(li);
    });
    $("#send-wa").disabled = !ns.length;
  }
  function setStamp(t, lock) {
    locked = lock; stampT = t;
    $("#stamp-time").textContent = fmt(t);
    $("#stamp-follow").hidden = !lock;
  }

  function open(id, t) {
    const v = byId[id]; if (!v) return;
    const first = !cur; cur = v;
    const ids = visibleIds().includes(id) ? visibleIds() : ALL.map(x => x.id), i = ids.indexOf(id);
    $("#m-no").textContent = pad(ALL.indexOf(v) + 1); $("#m-total").textContent = pad(ALL.length);
    $("#m-title").textContent = v.title;
    $("#m-sub").textContent = [v.client, v.category, v.duration].filter(Boolean).join("  ·  ");
    const st = $("#m-status"); st.textContent = STATUS[v.status] || v.status; st.dataset.s = v.status;
    $("#prev").disabled = $("#next").disabled = ids.length < 2;
    modal._ids = ids; modal._i = i;
    noteText.value = ""; setStamp(0, false); renderNotes();
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("lock");
    playVideo(v, t);
    clearInterval(clock);
    clock = setInterval(() => { if (!locked) setStamp(now(), false); }, 400);
    if (first) setTimeout(() => $(".close", modal).focus({ preventScroll: true }), 50);
  }
  function close(updateHash = true) {
    if (!cur) return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock");
    try { player && player.pauseVideo(); } catch {}
    clearInterval(clock); cur = null;
    if (updateHash && /^#\/v\//.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#/");
  }
  function step(d) {
    const ids = modal._ids, nid = ids[(modal._i + d + ids.length) % ids.length];
    location.replace("#/v/" + nid);
  }

  const route = () => {
    const m = location.hash.match(/^#\/v\/([\w-]+)(?:\?t=(\d+))?/);
    if (m && byId[m[1]]) open(m[1], m[2] ? +m[2] : 0); else close(false);
  };
  addEventListener("hashchange", route);
  route();

  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) close(); });
  $("#prev").onclick = () => step(-1);
  $("#next").onclick = () => step(1);
  addEventListener("keydown", e => {
    if (!cur) return;
    if (e.key === "Escape") close();
    else if (!/^(TEXTAREA|INPUT)$/.test(document.activeElement.tagName)) {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    }
  });

  noteText.addEventListener("focus", () => { if (!locked) { try { player && player.pauseVideo(); } catch {} setStamp(now(), true); } });
  $("#stamp-follow").onclick = () => setStamp(now(), false);
  $("#note-form").addEventListener("submit", e => {
    e.preventDefault();
    const text = noteText.value.trim(); if (!text) return;
    const ns = getNotes(cur.id); ns.push({ t: stampT, text, at: Date.now() });
    store.set(notesKey(cur.id), ns); noteText.value = ""; setStamp(now(), false); renderNotes(); toast("Catatan ditambah");
    try { player && player.playVideo(); } catch {}
  });
  noteText.addEventListener("keydown", e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) $("#note-form").requestSubmit(); });

  const buildNotes = () => {
    const ns = getNotes(cur.id).sort((a, b) => a.t - b.t);
    return `*Revisi — ${cur.title}* (${cur.client})\n\n` + ns.map(n => `• ${fmt(n.t)} — ${n.text}`).join("\n") + `\n\n${shareUrl(cur.id)}`;
  };
  const wa = txt => window.open(`https://wa.me/${S.whatsapp || ""}?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  $("#send-wa").onclick = () => wa(buildNotes());
  $("#copy-notes").onclick = () => getNotes(cur.id).length ? copy(buildNotes()) : toast("Belum ada catatan");
  $("#approve").onclick = () => { if (confirm(`Approve "${cur.title}"?`)) wa(`✅ *APPROVED* — ${cur.title} (${cur.client})\n\n${shareUrl(cur.id)}`); };
  $("#copylink").onclick = () => copy(shareUrl(cur.id, now()));
})();
