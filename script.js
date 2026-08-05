// Julia Kasanzewa — Portfolio interactions
(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Preloader ---------- */
  var preloader = document.querySelector(".preloader");
  if (preloader) {
    var played = sessionStorage.getItem("introPlayed") === "true";
    var hidePreloader = function(){
      preloader.classList.add("hide");
      sessionStorage.setItem("introPlayed", "true");
    };
    if (played || reduceMotion) {
      preloader.classList.add("hide");
    } else {
      window.addEventListener("load", function(){ setTimeout(hidePreloader, 550); });
      setTimeout(hidePreloader, 2200); // safety fallback
    }
  }

  /* ---------- Scroll progress bar ---------- */
  var progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    var ticking = false;
    var updateProgress = function(){
      ticking = false;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      progressFill.style.transform = "scaleX(" + p + ")";
    };
    var requestTick = function(){
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    };
    updateProgress();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
  }

  /* ---------- Island nav ---------- */
  var island = document.querySelector(".island");
  var islandToggle = document.querySelector(".island-toggle");
  var islandOverlay = document.querySelector(".island-overlay");
  var islandLinks = document.querySelectorAll(".island-links a");

  function setIslandOpen(open){
    if (!island) return;
    island.setAttribute("data-open", open ? "true" : "false");
    if (islandToggle) islandToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (islandOverlay) islandOverlay.classList.toggle("show", open);
  }

  if (islandToggle) {
    islandToggle.addEventListener("click", function(){
      var open = island.getAttribute("data-open") === "true";
      setIslandOpen(!open);
    });
  }
  if (islandOverlay) {
    islandOverlay.addEventListener("click", function(){ setIslandOpen(false); });
  }
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") setIslandOpen(false);
  });

  /* ---------- Dev / Creator mode switch (iOS-style toggle, whole-site reskin) ---------- */
  var iosSwitch = document.querySelector(".ios-switch");
  var modeLabels = document.querySelectorAll(".mode-label");
  var devTrack = document.getElementById("dev-track");
  var creatorTrack = document.getElementById("creator-track");
  var trackForAnchor = { "dev-track": "dev", "creator-track": "creator", "founder": "creator" };

  function setMode(mode){
    var isCreator = mode === "creator";
    document.documentElement.setAttribute("data-theme", isCreator ? "creator" : "dev");
    if (iosSwitch) iosSwitch.setAttribute("aria-checked", isCreator ? "true" : "false");
    modeLabels.forEach(function(l){
      l.classList.toggle("active", l.getAttribute("data-side") === mode);
    });
    if (devTrack) devTrack.classList.toggle("mode-hidden", isCreator);
    if (creatorTrack) creatorTrack.classList.toggle("mode-hidden", !isCreator);
    try { sessionStorage.setItem("mode", mode); } catch (e) {}
  }

  if (iosSwitch) {
    iosSwitch.addEventListener("click", function(){
      var next = iosSwitch.getAttribute("aria-checked") === "true" ? "dev" : "creator";
      setMode(next);
    });
  }
  modeLabels.forEach(function(l){
    l.addEventListener("click", function(){ setMode(l.getAttribute("data-side")); });
  });
  var savedMode = "dev";
  try { savedMode = sessionStorage.getItem("mode") || "dev"; } catch (e) {}
  setMode(savedMode);

  islandLinks.forEach(function(a){
    a.addEventListener("click", function(e){
      setIslandOpen(false);
      var id = (a.getAttribute("href") || "").replace("#", "");
      var mode = trackForAnchor[id];
      if (mode) {
        e.preventDefault();
        setMode(mode);
        var delay = reduceMotion ? 0 : 620;
        setTimeout(function(){
          var target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }, delay);
      }
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          islandLinks.forEach(function(a){
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function(s){ navObserver.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .card, .tl-item");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---------- Hero spotlight (mouse-reactive reveal) ---------- */
  var spotlightWrap = document.querySelector(".spotlight-wrap");
  var glowLayer = document.querySelector(".marquee-glow");
  if (spotlightWrap && glowLayer && canHover && !reduceMotion) {
    var radius = 170;
    spotlightWrap.addEventListener("mousemove", function(e){
      var rect = spotlightWrap.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      glowLayer.style.clipPath = "circle(" + radius + "px at " + x + "px " + y + "px)";
    });
    spotlightWrap.addEventListener("mouseleave", function(){
      glowLayer.style.clipPath = "circle(0px at 50% 50%)";
    });
  }

  /* ---------- Hero role cycler ---------- */
  var roleEl = document.getElementById("heroRole");
  var roles = ["ios developer", "backend engineer", "content creator", "founder"];
  if (roleEl && !reduceMotion) {
    var ri = 0, ci = 0, deleting = false;
    var typeSpeed = 60, deleteSpeed = 32, holdTime = 1300, gapTime = 400;
    function tick(){
      var word = roles[ri];
      if (!deleting) {
        ci++;
        roleEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, holdTime); return; }
        setTimeout(tick, typeSpeed);
      } else {
        ci--;
        roleEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, gapTime); return; }
        setTimeout(tick, deleteSpeed);
      }
    }
    setTimeout(tick, 700);
  } else if (roleEl) {
    roleEl.textContent = roles[0];
  }

  /* ---------- Local clock ---------- */
  var clockEl = document.getElementById("localClock");
  if (clockEl) {
    var pad = function(n){ return String(n).padStart(2, "0"); };
    var updateClock = function(){
      var d = new Date();
      clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ---------- Custom cursor pill ---------- */
  var cursorPill = document.querySelector(".cursor-pill");
  if (cursorPill && canHover && !reduceMotion) {
    document.addEventListener("mousemove", function(e){
      cursorPill.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%) scale(" + (cursorPill.classList.contains("show") ? 1 : .8) + ")";
    });
    document.addEventListener("pointerover", function(e){
      var target = e.target.closest("[data-cursor]");
      if (target) {
        cursorPill.textContent = target.getAttribute("data-cursor");
        cursorPill.classList.add("show");
      }
    });
    document.addEventListener("pointerout", function(e){
      var target = e.target.closest("[data-cursor]");
      if (target) cursorPill.classList.remove("show");
    });
  } else if (cursorPill) {
    cursorPill.remove();
  }

  /* ---------- Folder project browser ---------- */
  document.querySelectorAll(".folder-grid").forEach(function(grid){
    var items = grid.querySelectorAll(".folder-item");
    items.forEach(function(item){
      item.addEventListener("click", function(){
        var id = item.getAttribute("data-target");
        var panel = document.getElementById(id);
        if (!panel) return;
        var alreadyOpen = panel.classList.contains("open");
        items.forEach(function(other){
          var otherPanel = document.getElementById(other.getAttribute("data-target"));
          if (otherPanel) otherPanel.classList.remove("open");
          other.setAttribute("aria-expanded", "false");
        });
        if (!alreadyOpen) {
          panel.classList.add("open");
          item.setAttribute("aria-expanded", "true");
          if (!reduceMotion) {
            setTimeout(function(){ panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 350);
          }
        }
      });
    });
  });

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
