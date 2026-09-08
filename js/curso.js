// ============================================================
// NetBlue — Curso de Redes de Computadores
// Interações: menu mobile, progresso de leitura, scrollspy,
// revelação de conteúdo ao rolar e cópia de comandos.
// ============================================================
 
document.addEventListener('DOMContentLoaded', () => {
 
    // ==================== MOBILE MENU ====================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');
 
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
 
    // Dropdown mobile (abre/fecha ao tocar no item pai)
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown');
 
        if (dropdown && link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    item.classList.toggle('open');
                }
            });
        }
    });
 
    // Fecha o menu ao escolher um item do dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            navItems.forEach(ni => ni.classList.remove('open'));
        });
    });
 
    // ==================== SCROLL TO TOP ====================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
 
    // ==================== SMOOTH SCROLL PARA ÂNCORAS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
 
    // ==================== NAVBAR, PROGRESSO E SCROLLSPY (1 listener) ====================
    const navbar = document.querySelector('.navbar');
    const progressFill = document.getElementById('progressFill');
    const sections = document.querySelectorAll('.section[id]');
    const sectionNavItems = document.querySelectorAll('.nav-item[data-section]');
 
    function onScroll() {
        const scrollY = window.scrollY;
 
        // Navbar com fundo sólido após rolar
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 40);
        }
 
        // Botão de voltar ao topo
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollY > 500);
        }
 
        // Barra de progresso de leitura
        if (progressFill) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            progressFill.style.width = progress + '%';
        }
 
        // Scrollspy: destaca o módulo atual no menu
        if (sections.length && sectionNavItems.length) {
            let currentId = null;
            const probe = scrollY + window.innerHeight * 0.3;
 
            sections.forEach(section => {
                if (section.offsetTop <= probe) {
                    currentId = section.id;
                }
            });
 
            sectionNavItems.forEach(item => {
                item.classList.toggle('active-section', item.dataset.section === currentId);
            });
        }
    }
 
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
 
    // ==================== REVELAÇÃO DE CONTEÚDO AO ROLAR ====================
    const revealTargets = document.querySelectorAll('.card, .section-header, .info-box, .hero-stats .stat-item');
    revealTargets.forEach(el => el.classList.add('reveal'));
 
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
 
        revealTargets.forEach(el => revealObserver.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('in-view'));
    }
 
    // ==================== COPIAR COMANDOS DOS BLOCOS DE CÓDIGO ====================
    document.querySelectorAll('.code-block').forEach(block => {
        const codeEl = block.querySelector('code');
        if (!codeEl) return;
 
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.innerHTML = '<i class="fas fa-copy"></i> copiar';
        btn.setAttribute('aria-label', 'Copiar comando');
        block.appendChild(btn);
 
        btn.addEventListener('click', async () => {
            const text = codeEl.innerText.trim();
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                // Contorno para navegadores sem permissão de clipboard
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> copiado';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> copiar';
            }, 1800);
        });
    });
 
    // ==================== ANIMAÇÃO DE PACOTES NO HERO ====================
    // Gera pontos "pacote" extras percorrendo os caminhos do SVG,
    // com atraso aleatório para um fluxo mais orgânico.
    document.querySelectorAll('.hero-network [data-path]').forEach((path, i) => {
        const packet = path.parentElement.querySelector(`.hn-packet[data-for="${path.dataset.path}"]`);
        if (!packet) return;
        const anim = packet.querySelector('animateMotion');
        if (anim) {
            anim.setAttribute('begin', (i * 0.6) + 's');
        }
    });
});
