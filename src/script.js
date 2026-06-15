window.addEventListener('DOMContentLoaded', function() {
    // Leaderboard tag styling
    function styleLeaderboardTag() {
        const leaderboardTag = document.getElementById('leaderboard-tag');
        if (leaderboardTag) {
            const words = leaderboardTag.textContent.split(' ');
            if (words.length > 2) {
                words[2] = `<span class="highlight">${words[2]}</span>`;
                leaderboardTag.innerHTML = words.join(' ');
            }
        }
    }

    // Initialize leaderboard tag styling
    styleLeaderboardTag();
    

    // Photo gallery functionality
    function initPhotoGallery() {
        const galleryImages = document.querySelectorAll('.photo-gallery img');
        const featureImage = document.getElementById('feature-image');
        const imageCaption = document.getElementById('image-caption');
        
        if (featureImage && imageCaption) {
            galleryImages.forEach(img => {
                img.addEventListener('click', function() {
                    featureImage.src = this.src;
                    featureImage.alt = this.alt;
                    imageCaption.textContent = this.alt;
                });
            });
        }
    }

    // Initialize photo gallery
    initPhotoGallery();

    
    // Contact block h4 styling
    function styleContactHeaders() {
        const contactBlock = document.getElementById('contact-block');
        if (contactBlock) {
            const h4Elements = contactBlock.querySelectorAll('h4');
            h4Elements.forEach(h4 => {
                const words = h4.textContent.split(' ');
                const styledWords = words.map(word => {
                    if (word.toLowerCase() !== 'contact') {
                        return `<span style="color: white;">${word}</span>`;
                    }
                    return word;
                });
                h4.innerHTML = styledWords.join(' ');
            });
        }
    }

    // Initialize contact header styling
    styleContactHeaders();

    // Theme switcher functionality
    function initThemeSwitcher() {
        const themeButtons = document.querySelectorAll('[data-theme-toggle]');
        const themeStatus = document.getElementById('theme-status');
        const themes = ['purple', 'outlaws', 'warriors'];
        const themeLabels = {
            purple: 'Favorite Color',
            outlaws: 'Outlaws',
            warriors: 'Warriors'
        };
        const defaultTheme = 'purple';
        const storageKey = 'preferred_theme';

        if (!themeButtons.length) {
            return;
        }

        const announceTheme = (theme) => {
            if (!themeStatus) {
                return;
            }

            themeStatus.textContent = `Theme set to ${themeLabels[theme] || theme}.`;
        };

        const applyTheme = (theme, announce = false) => {
            if (!themes.includes(theme)) {
                return;
            }

            document.documentElement.setAttribute('data-theme', theme);
            themeButtons.forEach(button => {
                const isActive = button.dataset.themeToggle === theme;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });
            if (announce) {
                announceTheme(theme);
            }
        };

        const persistTheme = (theme) => {
            try {
                localStorage.setItem(storageKey, theme);
            } catch (error) {
                console.warn('Unable to persist theme preference:', error);
            }
        };

        const readSavedTheme = () => {
            try {
                return localStorage.getItem(storageKey);
            } catch (error) {
                return null;
            }
        };

        const savedTheme = readSavedTheme();
        const initialTheme = themes.includes(savedTheme) ? savedTheme : defaultTheme;
        applyTheme(initialTheme);

        themeButtons.forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.themeToggle === initialTheme));
            button.addEventListener('click', function() {
                const selectedTheme = this.dataset.themeToggle;
                applyTheme(selectedTheme, true);
                persistTheme(selectedTheme);
            });
        });

        document.addEventListener('keydown', function(event) {
            if (!(event.altKey && event.shiftKey && event.key.toLowerCase() === 't')) {
                return;
            }

            const currentTheme = document.documentElement.getAttribute('data-theme') || defaultTheme;
            const currentIndex = themes.indexOf(currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            applyTheme(nextTheme, true);
            persistTheme(nextTheme);
        });
    }

    // Initialize theme switcher
    initThemeSwitcher();

    // Mobile navigation menu handling
    function initMobileNavigation() {
        // Get all navigation links that navigate to sections on the same page
        const navLinks = document.querySelectorAll('.offcanvas-body .nav-link[href^="#"]');
        const offcanvasElement = document.getElementById('navbarSupportedContent');
        
        if (offcanvasElement) {
            // Create Bootstrap offcanvas instance
            const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
            
            // Add click handlers to navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Only close menu on mobile/tablet (when offcanvas is actually shown)
                    if (offcanvasElement.classList.contains('show')) {
                        // Small delay to ensure navigation happens first
                        setTimeout(() => {
                            offcanvas.hide();
                        }, 100);
                    }
                });
            });
        }
    }

    // Initialize mobile navigation
    initMobileNavigation();

    // Contact bubble overlay/backdrop handling for desktop
    function initContactOverlay() {
        const contactToggle = document.querySelector('.nav-contact-toggle');
        const contactBubble = document.getElementById('header-contact-bubble');
        if (!contactToggle || !contactBubble) return;

        // Ensure any previous desktop backdrop is removed
        let backdropEl = null;
        let docClickHandler = null;

        const createBackdrop = () => {
            backdropEl = document.createElement('div');
            backdropEl.className = 'header-contact-backdrop';
            backdropEl.style.position = 'fixed';
            backdropEl.style.inset = '0';
            backdropEl.style.background = 'rgba(0,0,0,0.24)';
            backdropEl.style.zIndex = 1050;
            backdropEl.style.opacity = '0';
            backdropEl.style.transition = 'opacity 150ms ease-in-out';
            document.body.appendChild(backdropEl);
            // small timeout to trigger fade
            requestAnimationFrame(() => backdropEl.style.opacity = '1');
            backdropEl.addEventListener('click', function (ev) { ev.stopPropagation(); hideBubble(); });
        };

        const removeBackdrop = () => {
            if (!backdropEl) return;
            backdropEl.style.opacity = '0';
            backdropEl.addEventListener('transitionend', () => {
                if (backdropEl && backdropEl.parentNode) backdropEl.parentNode.removeChild(backdropEl);
                backdropEl = null;
            }, { once: true });
        };

        const originalParent = contactBubble.parentElement;
        let movedToBody = false;

        const showBubble = () => {
            // For desktop only
            if (window.innerWidth < 992) return; // bootstrap lg breakpoint

            // Prevent Bootstrap collapse behavior by ensuring data attributes removed
            contactToggle.removeAttribute('data-bs-toggle');
            contactToggle.removeAttribute('data-bs-target');

            // Move bubble into body so it escapes any stacking context and sits above backdrop
            if (!movedToBody) {
                contactBubble.classList.add('floating');
                document.body.appendChild(contactBubble);
                movedToBody = true;
            }

            // Ensure the bubble is visible (inline style) and add show class so CSS transitions to visible state
            contactBubble.style.display = 'flex';
            contactBubble.classList.add('show');
            contactBubble.classList.remove('collapsing');

            // Wait a frame so the element becomes visible and gets computed layout, then position it
            requestAnimationFrame(() => {
                const toggleRect = contactToggle.getBoundingClientRect();
                const bubbleRect = contactBubble.getBoundingClientRect();
                // Center bubble under the toggle, clamped to viewport edges
                let left = Math.round(toggleRect.left + (toggleRect.width - bubbleRect.width) / 2);
                left = Math.max(8, Math.min(left, window.innerWidth - bubbleRect.width - 8));
                const top = toggleRect.bottom + 8; // small gap

                contactBubble.style.position = 'fixed';
                contactBubble.style.left = `${left}px`;
                contactBubble.style.top = `${top}px`;

                // create backdrop after bubble is shown to avoid early clicks hitting backdrop
                createBackdrop();

                // hide when clicking anywhere outside the bubble or toggle
                docClickHandler = function (evt) {
                    if (!contactBubble.contains(evt.target) && !contactToggle.contains(evt.target)) {
                        hideBubble();
                    }
                };
                // use pointerdown at capture phase to reliably detect outside interactions even if other handlers stop propagation
                document.addEventListener('pointerdown', docClickHandler, true);
                // also attach click as a fallback
                document.addEventListener('click', docClickHandler);
            });
        };

        const hideBubble = () => {
            contactBubble.classList.remove('show');
            removeBackdrop();

            // reset inline positioning if we moved it
            if (movedToBody) {
                contactBubble.style.position = '';
                contactBubble.style.left = '';
                contactBubble.style.top = '';
                // move back to original parent so DOM order stays consistent
                if (originalParent) originalParent.appendChild(contactBubble);
                movedToBody = false;
            }

            // Hide via inline style so it doesn't flash before CSS applies
            contactBubble.style.display = 'none';
            if (docClickHandler) {
                document.removeEventListener('pointerdown', docClickHandler, true);
                document.removeEventListener('click', docClickHandler);
                docClickHandler = null;
            }
        };

        // Attach to the toggle
        contactToggle.addEventListener('click', function(e) {
            // For mobile, let Bootstrap handle collapse within offcanvas
            if (window.innerWidth < 992) return;

            // Prevent default and stop other handlers (Bootstrap) from toggling
            e.preventDefault();
            e.stopImmediatePropagation();

            if (contactBubble.classList.contains('show')) {
                hideBubble();
            } else {
                showBubble();
            }
        });

        // On resize, toggle data attributes presence so mobile still uses Bootstrap collapse
        const manageBootstrapAttributes = () => {
            if (window.innerWidth >= 992) {
                contactToggle.removeAttribute('data-bs-toggle');
                contactToggle.removeAttribute('data-bs-target');
            } else {
                contactToggle.setAttribute('data-bs-toggle', 'collapse');
                contactToggle.setAttribute('data-bs-target', '#header-contact-bubble');
            }
        };

        window.addEventListener('resize', manageBootstrapAttributes);
        // initialize correct behavior
        manageBootstrapAttributes();

        // Ensure offcanvas shows contact icons automatically on mobile and hides when closed
        const offcanvasEl = document.getElementById('navbarSupportedContent');
        if (offcanvasEl) {
            offcanvasEl.addEventListener('shown.bs.offcanvas', function () {
                if (window.innerWidth < 992) {
                    // show icons inline under Contact in the offcanvas
                    contactBubble.style.display = 'flex';
                }
            });

            offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
                if (window.innerWidth < 992) {
                    contactBubble.style.display = 'none';
                }
            });
        }

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactBubble.classList.contains('show')) {
                hideBubble();
            }
        });
    }

    initContactOverlay();
});