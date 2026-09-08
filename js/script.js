document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const revealItems = document.querySelectorAll(".reveal");
  const networkVisual = document.getElementById("networkVisual");

  /* Navbar state on scroll */
  function updateNavbar() {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* Mobile menu */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));

  /* Subtle hero visual parallax (mouse-driven, desktop only) */
  if (networkVisual && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      networkVisual.style.transform = `rotateY(${x}deg) rotateX(${-y + 10}deg)`;
    });

    document.addEventListener("mouseleave", () => {
      networkVisual.style.transform = "rotateY(0deg) rotateX(10deg)";
    });
  }

  /* Smooth anchor scrolling */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* ---------------------------------------------
     Carousel: arrows, dots, autoplay, drag/swipe
  --------------------------------------------- */
  class Carousel {
    constructor(root) {
      this.root = root;
      this.viewport = root.querySelector(".carousel-viewport");
      this.track = root.querySelector(".carousel-track");
      this.slides = Array.from(this.track.children);
      this.prevBtn = root.querySelector("#carouselPrev") || root.querySelector(".carousel-arrow.prev");
      this.nextBtn = root.querySelector("#carouselNext") || root.querySelector(".carousel-arrow.next");
      this.dotsWrap = root.querySelector(".carousel-dots");

      this.index = 0;
      this.perView = this.getPerView();
      this.maxIndex = Math.max(0, this.slides.length - this.perView);

      this.autoplayDelay = 4500;
      this.autoplayTimer = null;

      this.isDragging = false;
      this.dragStartX = 0;
      this.dragDelta = 0;

      this.init();
    }

    getPerView() {
      const w = window.innerWidth;
      if (w <= 768) return 1;
      if (w <= 1180) return 2;
      return 3;
    }

    buildDots() {
      if (!this.dotsWrap) return;
      this.dotsWrap.innerHTML = "";
      const dotCount = this.maxIndex + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
        dot.addEventListener("click", () => this.goTo(i, true));
        this.dotsWrap.appendChild(dot);
      }
      this.updateDots();
    }

    updateDots() {
      if (!this.dotsWrap) return;
      Array.from(this.dotsWrap.children).forEach((dot, i) => {
        dot.classList.toggle("active", i === this.index);
      });
    }

    update() {
      const slideWidth = this.slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
      const offset = this.index * (slideWidth + gap);
      this.track.style.transform = `translateX(-${offset}px)`;
      this.updateDots();
    }

    goTo(i, userInitiated) {
      this.index = Math.min(Math.max(i, 0), this.maxIndex);
      this.update();
      if (userInitiated) this.restartAutoplay();
    }

    next() {
      this.goTo(this.index >= this.maxIndex ? 0 : this.index + 1);
    }

    prev() {
      this.goTo(this.index <= 0 ? this.maxIndex : this.index - 1);
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => this.next(), this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) clearInterval(this.autoplayTimer);
    }

    restartAutoplay() {
      this.startAutoplay();
    }

    handleResize() {
      const newPerView = this.getPerView();
      if (newPerView !== this.perView) {
        this.perView = newPerView;
        this.maxIndex = Math.max(0, this.slides.length - this.perView);
        this.index = Math.min(this.index, this.maxIndex);
        this.buildDots();
      }
      this.update();
    }

    initDrag() {
      const start = (clientX) => {
        this.isDragging = true;
        this.dragStartX = clientX;
        this.dragDelta = 0;
        this.track.classList.add("dragging");
        this.stopAutoplay();
      };

      const move = (clientX) => {
        if (!this.isDragging) return;
        this.dragDelta = clientX - this.dragStartX;
        this.track.style.transform = `translateX(calc(-${this.index * 100}% / ${this.perView} + ${this.dragDelta}px))`;
      };

      const end = () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.classList.remove("dragging");

        const threshold = 60;
        if (this.dragDelta > threshold) {
          this.prev();
        } else if (this.dragDelta < -threshold) {
          this.next();
        } else {
          this.update();
        }
        this.restartAutoplay();
      };

      this.track.addEventListener("mousedown", (e) => start(e.clientX));
      window.addEventListener("mousemove", (e) => move(e.clientX));
      window.addEventListener("mouseup", end);

      this.track.addEventListener(
        "touchstart",
        (e) => start(e.touches[0].clientX),
        { passive: true }
      );
      this.track.addEventListener(
        "touchmove",
        (e) => move(e.touches[0].clientX),
        { passive: true }
      );
      this.track.addEventListener("touchend", end);
    }

    init() {
      this.buildDots();
      this.update();
      this.initDrag();

      if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.goTo(this.index + 1 > this.maxIndex ? 0 : this.index + 1, true));
      if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.goTo(this.index - 1 < 0 ? this.maxIndex : this.index - 1, true));

      this.root.addEventListener("mouseenter", () => this.stopAutoplay());
      this.root.addEventListener("mouseleave", () => this.startAutoplay());

      window.addEventListener("resize", () => this.handleResize());

      this.startAutoplay();
    }
  }

  document.querySelectorAll(".carousel").forEach((el) => new Carousel(el));
});
