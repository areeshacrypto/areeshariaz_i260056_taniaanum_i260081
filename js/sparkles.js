// Sparkles that follow the cursor (or finger). Skipped if the visitor prefers reduced motion.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var light = ["#f4a3ad", "#e98a96", "#a8b67f", "#f7c8ce", "#e8d48c"];   // visible on cream
  var dark  = ["#f9c3cb", "#fff1d0", "#f4a3ad", "#ffffff", "#c9d3a2"];   // visible on dark
  var last = 0;

  function spawn(x, y) {
    var theme = document.documentElement.getAttribute("data-bs-theme");
    var colors = theme === "dark" ? dark : light;
    var s = document.createElement("span");
    var size = 8 + Math.random() * 12;
    s.className = "sparkle";
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.width = s.style.height = size + "px";
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    s.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
    s.style.setProperty("--dy", (Math.random() * 50 + 10) + "px");
    s.addEventListener("animationend", function () { s.remove(); });
    document.body.appendChild(s);
  }

  document.addEventListener("pointermove", function (e) {
    var now = Date.now();
    if (now - last < 35) return;          // limit how many are created
    last = now;
    spawn(e.clientX, e.clientY);
  });
})();