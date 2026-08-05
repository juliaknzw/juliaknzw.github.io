// Julia Kasanzewa — Portfolio interactions
(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function(){
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navA = document.querySelectorAll(".nav-links a[href^='#']");
  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navA.forEach(function(a){
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

  /* ---------- Hero role typewriter ---------- */
  var roleEl = document.getElementById("heroRole");
  var roles = ["iOS Developer", "Backend Engineer", "Content Creator", "Founder"];
  if (roleEl && !reduceMotion) {
    var ri = 0, ci = 0, deleting = false;
    var typeSpeed = 65, deleteSpeed = 35, holdTime = 1400, gapTime = 400;

    function tick(){
      var word = roles[ri];
      var textNode = roleEl.firstChild;
      if (!deleting) {
        ci++;
        textNode.nodeValue = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, holdTime);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        ci--;
        textNode.nodeValue = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          setTimeout(tick, gapTime);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }
    var initialText = document.createTextNode("");
    roleEl.insertBefore(initialText, roleEl.firstChild);
    setTimeout(tick, 500);
  } else if (roleEl) {
    roleEl.insertBefore(document.createTextNode(roles[0]), roleEl.firstChild);
  }

  /* ---------- Focus segment filter (Development / Content & Growth / All) ---------- */
  var segment = document.querySelector(".segment");
  var filterables = document.querySelectorAll("[data-cat]");
  if (segment) {
    segment.addEventListener("click", function(e){
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      segment.querySelectorAll("button").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      filterables.forEach(function(el){
        var cats = (el.getAttribute("data-cat") || "").split(" ");
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        el.hidden = !show;
      });
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function(){
      toTop.classList.toggle("show", window.scrollY > 800);
    }, { passive: true });
    toTop.addEventListener("click", function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
