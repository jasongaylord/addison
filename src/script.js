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

            const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
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
});