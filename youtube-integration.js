// YouTube Integration
class YouTubeManager {
    constructor() {
        this.settings = null;
        this.videos = [];
    }

    async loadSettings() {
        try {
            const response = await fetch('settings.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.settings = await response.json();
            return this.settings;
        } catch (error) {
            console.error('Error loading settings:', error);
            throw error;
        }
    }

    async fetchChannelVideos() {
        try {
            if (!this.settings) {
                await this.loadSettings();
            }

            const channelId = this.settings.youtube.channelId;
            const maxVideos = this.settings.youtube.maxVideos || 8;
            const apiKey = this.settings.api.youtubeApiKey;

            if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
                console.warn('YouTube API key not configured. Using mock data.');
                return this.getMockVideos();
            }

            // First, get the uploads playlist ID
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
            );

            if (!channelResponse.ok) {
                throw new Error(`Channel API error! status: ${channelResponse.status}`);
            }

            const channelData = await channelResponse.json();
            if (!channelData.items || channelData.items.length === 0) {
                throw new Error('Channel not found');
            }

            const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

            // Get the latest videos from the uploads playlist
            const videosResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxVideos}&order=date&key=${apiKey}`
            );

            if (!videosResponse.ok) {
                throw new Error(`Videos API error! status: ${videosResponse.status}`);
            }

            const videosData = await videosResponse.json();
            
            this.videos = videosData.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                publishedAt: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle
            }));

            return this.videos;
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            // Fallback to mock data
            return this.getMockVideos();
        }
    }

    getMockVideos() {
        // Mock data for development/fallback
        return [
            {
                id: 'dQw4w9WgXcQ',
                title: 'Addison\'s Best Plays - Summer 2025',
                description: 'Highlights from Addison\'s summer tournament season featuring her best defensive plays and hitting.',
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
                publishedAt: '2025-07-15T10:00:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'jNQXAC9IVRw',
                title: 'Catching Skills Development',
                description: 'Training session focused on improving catcher fundamentals and throwing mechanics.',
                thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg',
                publishedAt: '2025-06-20T14:30:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'y6120QOlsfU',
                title: 'Switch Hitting Practice',
                description: 'Working on switch hitting techniques and improving batting stance from both sides of the plate.',
                thumbnail: 'https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg',
                publishedAt: '2025-06-10T16:45:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'kJQP7kiw5Fk',
                title: 'Tournament Game vs Eagles',
                description: 'Full game highlights from the championship game against the Eagles featuring clutch hitting and defensive plays.',
                thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
                publishedAt: '2025-05-25T12:15:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'lDK9QqIzhwk',
                title: 'Infield Drills and Techniques',
                description: 'Comprehensive infield training covering shortstop positioning, double plays, and quick reactions.',
                thumbnail: 'https://img.youtube.com/vi/lDK9QqIzhwk/mqdefault.jpg',
                publishedAt: '2025-05-10T11:20:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'fJ9rUzIMcZQ',
                title: 'PA Outlaws Team Introduction',
                description: 'Meet the PA Outlaws 18U National team and learn about our goals for the upcoming season.',
                thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
                publishedAt: '2025-04-30T09:00:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'gYkq2e4xKTU',
                title: 'College Recruitment Tips',
                description: 'Advice for student-athletes on the college recruitment process and what coaches are looking for.',
                thumbnail: 'https://img.youtube.com/vi/gYkq2e4xKTU/mqdefault.jpg',
                publishedAt: '2025-04-15T13:45:00Z',
                channelTitle: 'Addison Gaylord Softball'
            },
            {
                id: 'X_8Nh5XfRw0',
                title: 'Off-Season Training Routine',
                description: 'Follow along with Addison\'s off-season training routine including strength training and skill development.',
                thumbnail: 'https://img.youtube.com/vi/X_8Nh5XfRw0/mqdefault.jpg',
                publishedAt: '2025-03-20T15:30:00Z',
                channelTitle: 'Addison Gaylord Softball'
            }
        ];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    createVideoCard(video) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="video-card" data-video-id="${video.id}" data-bs-toggle="modal" data-bs-target="#youtubeModal">
                    <div class="video-thumbnail-container">
                        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                        <div class="video-overlay">
                            <i class="fab fa-youtube fa-2x"></i>
                        </div>
                        <div class="video-title-overlay">
                            <h6 class="video-title">${video.title}</h6>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderVideos(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        try {
            const videos = await this.fetchChannelVideos();
            
            if (videos.length === 0) {
                container.innerHTML = `
                    <div class="text-center text-muted">
                        <i class="fab fa-youtube fa-3x mb-3"></i>
                        <p>No videos available at this time.</p>
                    </div>
                `;
                return;
            }

            const videosHtml = videos.map(video => this.createVideoCard(video)).join('');
            
            container.innerHTML = `
                <h2 class="text-center mb-4 text-white">
                    <i class="fab fa-youtube me-2"></i>
                    Latest Videos
                </h2>
                <div class="row">
                    ${videosHtml}
                </div>
            `;

            // Add click event listeners to video cards
            container.querySelectorAll('.video-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const videoId = card.dataset.videoId;
                    const video = videos.find(v => v.id === videoId);
                    if (video) {
                        this.showVideoModal(video);
                    }
                });
            });

        } catch (error) {
            console.error('Error rendering videos:', error);
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fab fa-youtube fa-3x mb-3"></i>
                    <p>Unable to load videos at this time.</p>
                    <small class="text-muted">Error: ${error.message}</small>
                </div>
            `;
        }
    }

    showVideoModal(video) {
        const modal = document.getElementById('youtubeModal');
        const modalTitle = modal.querySelector('#youtubeModalLabel');
        const modalBody = modal.querySelector('.modal-body');
        
        modalTitle.textContent = video.title;
        
        modalBody.innerHTML = `
            <div class="ratio ratio-16x9 mb-3">
                <iframe 
                    src="https://www.youtube.com/embed/${video.id}" 
                    title="${video.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            <div class="video-info">
                <h6>Published: ${this.formatDate(video.publishedAt)}</h6>
                <p class="video-description">${video.description}</p>
            </div>
        `;
    }
}

// Global function to load YouTube videos
async function loadYouTubeVideos(containerId) {
    const youtubeManager = new YouTubeManager();
    await youtubeManager.renderVideos(containerId);
}
