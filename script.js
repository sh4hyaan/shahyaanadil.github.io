/* =========================================================
   Shahyaan Adil — shared script
   Mobile menu, header state, scroll reveals, artwork lightbox.
   ========================================================= */
(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var label = toggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = open ? "Close" : "Menu";
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("nav-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880 && body.classList.contains("nav-open")) setMenu(false);
    });
  }

  /* ---------- Header hairline on scroll ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Artwork lightbox (Art page) ---------- */
  var galleryImages = document.querySelectorAll(".gallery img");
  if (galleryImages.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Artwork");
    box.innerHTML =
      '<button class="lightbox__close" type="button">Close</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);

    var boxImg = box.querySelector("img");
    var boxCap = box.querySelector("figcaption");
    var closeBtn = box.querySelector(".lightbox__close");
    var lastFocus = null;

    var openBox = function (img) {
      lastFocus = img;
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      var fig = img.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      boxCap.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
      box.classList.add("is-open");
      body.style.overflow = "hidden";
      closeBtn.focus();
    };
    var closeBox = function () {
      box.classList.remove("is-open");
      body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    galleryImages.forEach(function (img) {
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", function () { openBox(img); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBox(img); }
      });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === closeBtn) closeBox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) closeBox();
    });
  }
})();
