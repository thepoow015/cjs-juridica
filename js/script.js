// js/script.js

/**
 * CJS Jurídica - Script principal
 * Landing page para Clínica Jurídica Santo Domingo
 * 
 * ============================================
 * DATOS DE LA CLÍNICA - MODIFICAR AQUÍ
 * ============================================
 * Nombre: CJS Jurídica
 * Teléfono: +1 (809) 555-0123
 * WhatsApp: https://wa.me/18095550123
 * Email: contacto@cjsjuridica.com
 * Dirección: Piantini / Av. Abraham Lincoln, Santo Domingo
 * Redes: Instagram, Facebook, LinkedIn
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // NAVBAR STICKY CON CAMBIO DE APARIENCIA
    // ============================================
    const navbar = document.getElementById('mainNavbar');
    const backToTop = document.getElementById('backToTop');
    let lastScroll = 0;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar scrolled state
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar al cargar

    // ============================================
    // SMOOTH SCROLL PARA ENLACES INTERNOS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignorar enlaces que son solo "#" o modales
            if (targetId === '#' || this.hasAttribute('data-bs-toggle')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Cerrar menú móvil si está abierto
                const navbarCollapse = document.getElementById('navbarMain');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // ============================================
    // ACTUALIZAR ENLACE ACTIVO EN NAVBAR
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + navbar.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ============================================
    // ANIMACIONES AL ENTRAR EN VIEWPORT
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => animateObserver.observe(el));

    // ============================================
    // CONTADOR ANIMADO DE ESTADÍSTICAS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 1800;
                const start = performance.now();

                function updateNumber(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing out
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * target);
                    
                    stat.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.textContent = target;
                    }
                }

                requestAnimationFrame(updateNumber);
            });
        }
    }

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();

    // ============================================
    // VALIDACIÓN DEL FORMULARIO DE CONTACTO
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            let isValid = true;

            // Validar todos los campos requeridos
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                // Resetear estado
                field.classList.remove('is-invalid');
                field.classList.remove('is-valid');

                let fieldValid = true;

                // Validación según tipo de campo
                if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    fieldValid = emailRegex.test(field.value.trim());
                } else if (field.type === 'tel') {
                    const telRegex = /^[\d\s\+\-\(\)]{7,20}$/;
                    fieldValid = telRegex.test(field.value.trim());
                } else if (field.type === 'checkbox') {
                    fieldValid = field.checked;
                } else if (field.tagName === 'SELECT') {
                    fieldValid = field.value !== '';
                } else if (field.tagName === 'TEXTAREA') {
                    fieldValid = field.value.trim().length >= 10;
                } else {
                    fieldValid = field.value.trim().length >= 3;
                }

                if (!fieldValid) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.add('is-valid');
                }
            });

            if (!isValid) {
                // Scroll al primer campo inválido
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
                return;
            }

            // ============================================
            // SIMULACIÓN DE ENVÍO EXITOSO
            // En un proyecto real, aquí se enviarían los datos al servidor
            // ============================================
            
            // Mostrar mensaje de éxito (SweetAlert simulado)
            showSuccessMessage();

            // Resetear formulario
            contactForm.reset();
            contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(f => {
                f.classList.remove('is-valid', 'is-invalid');
            });
        });

        // Validación en tiempo real al salir de campos
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required')) {
                    let valid = true;
                    
                    if (this.type === 'email') {
                        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim());
                    } else if (this.type === 'checkbox') {
                        valid = this.checked;
                    } else if (this.tagName === 'SELECT') {
                        valid = this.value !== '';
                    } else if (this.tagName === 'TEXTAREA') {
                        valid = this.value.trim().length >= 10;
                    } else {
                        valid = this.value.trim().length >= 3;
                    }

                    this.classList.toggle('is-invalid', !valid && this.value.trim() !== '');
                    this.classList.toggle('is-valid', valid);
                }
            });
        });
    }

    // ============================================
    // MENSAJE DE ÉXITO (SWEETALERT SIMULADO)
    // ============================================
    function showSuccessMessage() {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 class="success-title">Solicitud recibida</h3>
                <p class="success-text">
                    Gracias por contactarnos. Revisaremos tu solicitud y te indicaremos los próximos pasos.
                </p>
                <button class="success-btn" id="successClose">Entendido</button>
            </div>
        `;

        // Estilos inline para el modal de éxito
        const style = document.createElement('style');
        style.textContent = `
            .success-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 27, 48, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(4px);
            }
            .success-overlay.show {
                opacity: 1;
            }
            .success-modal {
                background: #fff;
                border-radius: 16px;
                padding: 40px 32px;
                max-width: 440px;
                width: 100%;
                text-align: center;
                box-shadow: 0 24px 64px rgba(0,0,0,0.25);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            .success-overlay.show .success-modal {
                transform: scale(1);
            }
            .success-icon {
                font-size: 3.5rem;
                color: #25a244;
                margin-bottom: 20px;
            }
            .success-title {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 1.5rem;
                color: #1a2a4a;
                margin-bottom: 12px;
            }
            .success-text {
                font-size: 0.95rem;
                color: #5a6578;
                line-height: 1.7;
                margin-bottom: 24px;
            }
            .success-btn {
                background: #1a2a4a;
                color: #fff;
                border: none;
                padding: 12px 32px;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .success-btn:hover {
                background: #0f1b30;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Forzar reflow para animación
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // Cerrar modal
        function closeSuccess() {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                style.remove();
            }, 300);
        }

        document.getElementById('successClose').addEventListener('click', closeSuccess);
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeSuccess();
        });

        // Cerrar con Escape
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeSuccess();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ============================================
    // BOTÓN VOLVER ARRIBA
    // ============================================
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // AÑO AUTOMÁTICO EN FOOTER
    // ============================================
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // ============================================
    // CERRAR MENÚ MÓVIL AL HACER CLIC FUERA
    // ============================================
    document.addEventListener('click', function(e) {
        const navbarCollapse = document.getElementById('navbarMain');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        }
    });

    // ============================================
    // SCROLL SUAVE AL CARGAR CON HASH
    // ============================================
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }, 300);
    }

})();