/* Buff and nerf badges on the hangar floors.
   Reads patch-history.json (built from the official update notes by tools/build-patch-history.mjs)
   and puts a small badge after every robot, titan and weapon name it knows. The page redraws its
   floors often, so a MutationObserver re-applies the badges after each redraw. */
(function () {
  var css = ".hvb{display:inline-block;margin-left:6px;font:600 9px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.5px;" +
    "text-transform:uppercase;padding:3px 5px;border-radius:3px;vertical-align:1px;text-decoration:none;white-space:nowrap}" +
    ".hvb.buff{color:#8ff0bb;background:#123a26}.hvb.nerf{color:#ffaaaa;background:#4a1616}.hvb.mixed{color:#ffd486;background:#40300a}" +
    ".hvb.change{color:#b8c4d0;background:#2c3a4c}.hvb:hover{filter:brightness(1.25)}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var byName = null, SHORT = { buff: "Buff", nerf: "Nerf", mixed: "Buff+nerf", change: "Changed" };
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function badge(h) {
    var a = document.createElement("a");
    a.className = "hvb " + h.latest.verdict;
    a.href = "wiki/#/" + h.kind + "/" + slug(h.name);
    a.target = "_blank"; a.rel = "noopener";
    a.textContent = SHORT[h.latest.verdict] + " " + h.latest.ver;
    a.title = h.note + ". Open the patch history.";
    a.setAttribute("data-hvb", "1");
    a.addEventListener("click", function (e) { e.stopPropagation(); });
    return a;
  }
  function nameOf(el) {           // the name is the element's first text, before any <b> or badge
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.textContent.trim()) return n.textContent.trim().replace(/^TITAN\s+/, "");
    return "";
  }
  function apply() {
    if (!byName) return;
    var els = document.querySelectorAll(".gun span.g, .bot .nm, .cpgun .nm");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.querySelector("[data-hvb]")) continue;
      var h = byName[nameOf(el).toLowerCase()];
      if (h && h.latest) el.appendChild(badge(h));
    }
  }
  var timer = null;
  new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(apply, 120); })
    .observe(document.body, { childList: true, subtree: true });

  fetch("patch-history.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) {
    byName = {};
    Object.keys(d.items).forEach(function (k) { var h = d.items[k]; byName[h.name.toLowerCase()] = h; });
    apply();
  }).catch(function () {});
})();
