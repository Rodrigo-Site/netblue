// ==================== MOBILE MENU ====================
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        const navItems = document.querySelectorAll('.nav-item');

        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Mobile dropdown toggle
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown');
            
            if (dropdown && window.innerWidth <= 1024) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        item.classList.toggle('open');
                    }
                });
            }
        });

        // Close menu when clicking on a dropdown item
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navItems.forEach(ni => ni.classList.remove('open'));
            });
        });

        // ==================== SCROLL TO TOP ====================
        const scrollTopBtn = document.getElementById('scrollTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });


        // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // ==================== NAVBAR BACKGROUND ON SCROLL ====================
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 22, 40, 0.98)';
            } else {
                navbar.style.background = 'rgba(10, 22, 40, 0.95)';
            }
        });
