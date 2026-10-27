/* Site-wide search for gragg.life.
   Add <script src="/shared/search.js" defer></script> to any page. Pages with the shared
   .topbar get a search box in it; pages without one get a floating Search button.
   It searches every wiki robot, titan, weapon, drone and floor, the patch notes, the
   site's pages, the developers' news, Reddit threads and the War Robots videos. Press "/" anywhere to jump to it. */
(function () {
  if (window.__graggSearch) return;
  window.__graggSearch = true;

  var css = [
    ".gs{--gs-bg:#ffffff;--gs-fg:#15202b;--gs-dim:#5a6a7b;--gs-line:#d5dde6;--gs-hi:#fff1e0;--gs-acc:#d9700a;position:relative;font:14px/1.4 'IBM Plex Sans',system-ui,sans-serif}",
    "@media (prefers-color-scheme:dark){.gs{--gs-bg:#1c2733;--gs-fg:#e8f0f6;--gs-dim:#9fb2c4;--gs-line:#34475a;--gs-hi:#2c3a4c;--gs-acc:#ff9326}}",
    "[data-theme=light] .gs{--gs-bg:#ffffff;--gs-fg:#15202b;--gs-dim:#5a6a7b;--gs-line:#d5dde6;--gs-hi:#fff1e0;--gs-acc:#d9700a}",
    "[data-theme=dark] .gs{--gs-bg:#1c2733;--gs-fg:#e8f0f6;--gs-dim:#9fb2c4;--gs-line:#34475a;--gs-hi:#2c3a4c;--gs-acc:#ff9326}",
    ".gs-in{width:100%;min-width:0;background:var(--gs-bg);color:var(--gs-fg);border:1px solid var(--gs-line);border-radius:8px;padding:8px 12px 8px 32px;font:inherit;",
    "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%237b8a9a' stroke-width='2'%3E%3Ccircle cx='7' cy='7' r='5'/%3E%3Cpath d='m11 11 4 4'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:10px 50%}",
    ".gs-in:focus{outline:2px solid var(--gs-acc);outline-offset:1px}",
    ".gs-res{position:absolute;right:0;top:calc(100% + 6px);width:min(440px,calc(100vw - 32px));max-height:min(70vh,520px);overflow-y:auto;background:var(--gs-bg);color:var(--gs-fg);",
    "border:1px solid var(--gs-line);border-radius:10px;box-shadow:0 14px 40px rgba(0,0,0,.28);z-index:1000;padding:6px}",
    ".gs-res a{display:flex;gap:10px;align-items:baseline;padding:8px 10px;border-radius:6px;color:var(--gs-fg);text-decoration:none}",
    ".gs-res a.sel,.gs-res a:hover{background:var(--gs-hi)}",
    ".gs-res b{font-weight:600;flex:1;min-width:0}",
    ".gs-res small{display:block;font-weight:400;color:var(--gs-dim);font-size:12px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".gs-res i{font-style:normal;font:500 10px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.6px;text-transform:uppercase;color:var(--gs-acc);flex:none}",
    ".gs-none{padding:10px;color:var(--gs-dim);margin:0}",
    ".gs-bar{flex:1 1 220px;max-width:360px;margin-left:auto}",
    ".gs-fab{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:999;font:600 13px/1 'IBM Plex Sans',system-ui,sans-serif;",
    "background:var(--gs-bg);color:var(--gs-fg);border:1px solid var(--gs-line);border-radius:999px;padding:11px 16px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.3)}",
    "@media (max-width:620px){.gs-fab{bottom:calc(84px + env(safe-area-inset-bottom,0px))}}",
    ".gs-over{position:fixed;inset:0;z-index:1001;background:rgba(8,12,17,.55);display:flex;justify-content:center;align-items:flex-start;padding:12vh 16px 16px}",
    ".gs-over .gs{width:min(520px,100%)}",
    ".gs-over .gs-res{position:static;width:100%;margin-top:8px}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var items = null, videos = null, loading = null;
  function load() {
    if (loading) return loading;
    loading = Promise.all([
      fetch("/shared/search-index.json").then(function (r) { return r.json(); }).then(function (d) { items = d.items || []; }).catch(function () { items = []; }),
      fetch("/news/videos.json").then(function (r) { return r.json(); }).then(function (d) {
        videos = (d.videos || []).map(function (v) { return { t: v.title, k: "Video", u: v.url, s: v.published.slice(0, 10), ext: true }; });
      }).catch(function () { videos = []; })
    ]);
    return loading;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function find(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var all = (items || []).concat(videos || []), hits = [];
    for (var i = 0; i < all.length; i++) {
      var x = all[i], t = x.t.toLowerCase(), hay = t + " " + (x.s || "").toLowerCase() + " " + x.k.toLowerCase();
      if (!words.every(function (w) { return hay.indexOf(w) >= 0; })) continue;
      var score = t.indexOf(words[0]) === 0 ? 0 : words.every(function (w) { return t.indexOf(w) >= 0; }) ? 1 : 2;
      if (x.k === "Page") score -= 0.5;
      hits.push([score, i, x]);
    }
    hits.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    hits.forEach(function (h) { if (/^https?:/.test(h[2].u)) h[2].ext = true; });
    return hits.slice(0, 14).map(function (h) { return h[2]; });
  }

  function build(host, onPick) {
    var box = document.createElement("div"); box.className = "gs";
    box.innerHTML = '<input class="gs-in" type="search" placeholder="Search robots, weapons, patch notes, videos" aria-label="Search gragg.life" autocomplete="off"><div class="gs-res" hidden></div>';
    host.appendChild(box);
    var input = box.querySelector("input"), res = box.querySelector(".gs-res"), hits = [], sel = 0;
    function render() {
      var q = input.value.trim();
      if (!q) { res.hidden = true; return; }
      load().then(function () {
        if (input.value.trim() !== q) return;
        hits = find(q); sel = 0;
        res.innerHTML = hits.length ? hits.map(function (x, i) {
          return '<a href="' + esc(x.u) + '"' + (x.ext ? ' target="_blank" rel="noopener"' : "") + ' class="' + (i === sel ? "sel" : "") + '"><b>' + esc(x.t) +
            (x.s ? "<small>" + esc(x.s) + "</small>" : "") + "</b><i>" + esc(x.k) + "</i></a>";
        }).join("") : '<p class="gs-none">Nothing matches. Try one word, like a robot or weapon name.</p>';
        res.hidden = false;
      });
    }
    function go(x) {
      res.hidden = true; input.value = "";
      if (x.ext) { window.open(x.u, "_blank", "noopener"); }
      else {
        var here = location.pathname, path = x.u.split("#")[0];
        location.href = x.u;
        if (path === here) window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      if (onPick) onPick();
    }
    input.addEventListener("focus", load);
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!hits.length) return; e.preventDefault();
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length;
        [].forEach.call(res.children, function (a, i) { a.classList.toggle("sel", i === sel); });
      } else if (e.key === "Enter" && hits[sel]) { e.preventDefault(); go(hits[sel]); }
      else if (e.key === "Escape") { res.hidden = true; input.blur(); if (onPick) onPick(); }
    });
    res.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return;
      var i = [].indexOf.call(res.children, a); if (hits[i]) { e.preventDefault(); go(hits[i]); }
    });
    document.addEventListener("click", function (e) { if (!box.contains(e.target)) res.hidden = true; });
    return input;
  }

  function init() {
    var bar = document.querySelector(".topbar .container"), input;
    if (bar) {
      var wrap = document.createElement("div"); wrap.className = "gs-bar"; bar.appendChild(wrap);
      input = build(wrap);
    } else {
      var fab = document.createElement("button"); fab.className = "gs gs-fab"; fab.type = "button"; fab.textContent = "Search";
      fab.setAttribute("aria-label", "Search gragg.life"); document.body.appendChild(fab);
      var over = null;
      var open = function () {
        if (over) { over.hidden = false; over.querySelector("input").focus(); return; }
        over = document.createElement("div"); over.className = "gs-over";
        over.addEventListener("click", function (e) { if (e.target === over) over.hidden = true; });
        document.body.appendChild(over);
        build(over, function () { over.hidden = true; }).focus();
      };
      fab.addEventListener("click", open);
      input = { focus: open };
    }
    document.addEventListener("keydown", function (e) {
      var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.focus(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
