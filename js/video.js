// =====================================================
// NETBLUE — VIDEOAULAS
// Script principal: monta a miniatura e o player de cada
// aula a partir do link cadastrado no HTML (atributo
// data-youtube de cada .lesson-card), controla o modal do
// player e pequenas interações de navegação e scroll.
// =====================================================

(function() {
    "use strict";

    // Ícone de "play" reutilizado nas miniaturas
    const PLAY_ICON_SVG = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>
    </svg>`;

    // -----------------------------------------------------
    // Extrai o ID do vídeo de uma URL comum do YouTube
    // -----------------------------------------------------
    function getYouTubeId(url) {
        if (!url) return null;
        const patterns = [
            /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    // =====================================================
    // CARDS DE AULA
    // O conteúdo (título, descrição, categoria, link do
    // YouTube) já vem pronto do HTML. Aqui apenas montamos a
    // miniatura, o botão de play e a abertura do modal.
    // =====================================================

    function buildLessonThumb(card) {
        const thumb = card.querySelector(".lesson-thumb");
        if (!thumb) return;

        const youtubeUrl = card.getAttribute("data-youtube");
        const videoId = getYouTubeId(youtubeUrl);
        const title = card.querySelector("h3");
        const titleText = title ? title.textContent : "aula";

        if (videoId) {
            const img = document.createElement("img");
            img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            img.alt = `Miniatura da videoaula: ${titleText}`;
            img.loading = "lazy";
            img.addEventListener("error", () => {
                img.remove();
                thumb.classList.add("no-thumb");
            });
            thumb.insertBefore(img, thumb.firstChild);
        } else {
            thumb.classList.add("no-thumb");
        }

        const fallback = document.createElement("div");
        fallback.className = "lesson-thumb-fallback";
        fallback.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <rect x="2" y="5" width="15" height="14" rx="2"/><path d="M17 9l5-3v12l-5-3"/>
      </svg>
      <span>Prévia em breve</span>`;
        thumb.appendChild(fallback);

        const playBadge = document.createElement("div");
        playBadge.className = "play-badge";
        playBadge.innerHTML = PLAY_ICON_SVG;
        thumb.appendChild(playBadge);
    }

    function setupLessonCards() {
        const cards = document.querySelectorAll(".lesson-card[data-youtube]");

        cards.forEach((card, index) => {
            buildLessonThumb(card);
            card.style.transitionDelay = `${index * 70}ms`;

            const openHandler = () => openLessonModal(card);

            const thumb = card.querySelector(".lesson-thumb");
            if (thumb) {
                thumb.addEventListener("click", openHandler);
                thumb.addEventListener("keydown", (event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    openHandler();
                });
            }

            const watchButton = card.querySelector(".lesson-watch");
            if (watchButton) watchButton.addEventListener("click", openHandler);
        });
    }

    // =====================================================
    // MODAL / PLAYER DE VÍDEO
    // =====================================================

    const modal = document.getElementById("videoModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalClose = document.getElementById("modalClose");
    const modalTitle = document.getElementById("modalTitle");
    const modalCategory = document.getElementById("modalCategory");
    const playerFrame = document.getElementById("playerFrame");

    let lastFocusedElement = null;

    function openLessonModal(card) {
        if (!card || !modal) return;

        const youtubeUrl = card.getAttribute("data-youtube");
        const videoId = getYouTubeId(youtubeUrl);
        const titleEl = card.querySelector("h3");
        const categoryEl = card.querySelector(".lesson-category");

        modalTitle.textContent = titleEl ? titleEl.textContent : "Videoaula";
        modalCategory.textContent = categoryEl ? categoryEl.textContent : "NetBlue";

        if (videoId) {
            playerFrame.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
          title="${modalTitle.textContent}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`;
        } else {
            playerFrame.innerHTML = `
        <div class="player-placeholder">
          O link desta videoaula ainda não foi configurado.<br>
          Edite o atributo <code>data-youtube</code> deste card no arquivo PA.html.
        </div>`;
        }

        lastFocusedElement = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        modalClose.focus();
    }

    function closeLessonModal() {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        // Remove o iframe para interromper a reprodução do vídeo
        playerFrame.innerHTML = "";
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    if (modalClose) modalClose.addEventListener("click", closeLessonModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeLessonModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && modal.classList.contains("is-open")) {
            closeLessonModal();
        }
    });

    // =====================================================
    // MENU MOBILE
    // =====================================================

    function setupMobileNav() {
        const toggle = document.getElementById("navToggle");
        const headerInner = document.querySelector(".header-inner");
        if (!toggle || !headerInner) return;

        toggle.addEventListener("click", () => {
            const isOpen = headerInner.classList.toggle("menu-open");
            toggle.classList.toggle("open", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Fecha o menu ao clicar em um link
        headerInner.querySelectorAll(".main-nav a").forEach((link) => {
            link.addEventListener("click", () => {
                headerInner.classList.remove("menu-open");
                toggle.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // =====================================================
    // ANIMAÇÕES DE ENTRADA (SCROLL REVEAL)
    // =====================================================

    function setupScrollReveal() {
        const revealTargets = document.querySelectorAll(".reveal, .lesson-card");
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealTargets.forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        revealTargets.forEach((el) => observer.observe(el));
    }

    // =====================================================
    // SCROLL SUAVE PARA LINKS INTERNOS
    // (reforço além do scroll-behavior via CSS)
    // =====================================================

    function setupSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (event) => {
                const targetId = anchor.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const targetEl = document.querySelector(targetId);
                if (!targetEl) return;
                event.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }

    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    document.addEventListener("DOMContentLoaded", () => {
        setupLessonCards();
        setupMobileNav();
        setupScrollReveal();
        setupSmoothAnchors();
    });
})();
