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
        const themeSelect = document.getElementById('theme-switcher');
        const themeStatus = document.getElementById('theme-status');
        const themes = ['outlaws', 'warriors'];
        const themeLabels = {
            outlaws: 'Outlaws',
            warriors: 'Warriors'
        };
        const defaultTheme = 'outlaws';
        const storageKey = 'preferred_theme';

        if (!themeSelect) {
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
            themeSelect.value = theme;
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

        themeSelect.addEventListener('change', function() {
            const selectedTheme = this.value;
            applyTheme(selectedTheme, true);
            persistTheme(selectedTheme);
        });

        themeSelect.addEventListener('keydown', function(event) {
            const currentIndex = themes.indexOf(this.value);
            if (currentIndex === -1) {
                return;
            }

            let nextTheme = null;

            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                nextTheme = themes[(currentIndex + 1) % themes.length];
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                nextTheme = themes[(currentIndex - 1 + themes.length) % themes.length];
            } else if (event.key === 'Home') {
                nextTheme = themes[0];
            } else if (event.key === 'End') {
                nextTheme = themes[themes.length - 1];
            }

            if (nextTheme) {
                event.preventDefault();
                applyTheme(nextTheme, true);
                persistTheme(nextTheme);
            }
        });

        document.addEventListener('keydown', function(event) {
            if (!(event.altKey && event.shiftKey && event.key.toLowerCase() === 't')) {
                return;
            }

            const currentIndex = themes.indexOf(themeSelect.value);
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