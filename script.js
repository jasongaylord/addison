window.addEventListener('DOMContentLoaded', function() {
    const leaderboardTag = document.getElementById('leaderboard-tag');
    if (leaderboardTag) {
        const words = leaderboardTag.textContent.split(' ');
        if (words.length > 2) {
            words[2] = `<span class="highlight">${words[2]}</span>`;
            leaderboardTag.innerHTML = words.join(' ');
        }
    }

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
});