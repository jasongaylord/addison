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
                id: '2S4mLceEGFA',
                title: 'Slapped in the Go Ahead Runs to Win',
                description: 'In the top of the 6th against Holy Redeemer, Addison slapped a single to right center passed the second baseman who was playing closer to first. As a result, she picked up 2 RBIs and the go ahead runs.',
                thumbnail: 'https://i9.ytimg.com/vi_webp/2S4mLceEGFA/mq1.webp?sqp=COjCvcUG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFMgXShlMA8=&rs=AOn4CLDDhVVSWVbfzgRIj4M0UlVLDd-9OA',
                publishedAt: '2025-08-27T10:00:00Z',
                channelTitle: 'Offense - Slapping'
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

        // Always show the title first
        let html = `
            <h2 class="mb-4" style="color: #29004f;">
                <i class="fab fa-youtube me-2" style="color: #bf7cff;"></i>
                Highlight Videos
            </h2>
        `;

        try {
            const videos = await this.fetchChannelVideos();
            
            if (videos.length === 0) {
                html += `
                    <div class="text-center text-muted">
                        <i class="fab fa-youtube fa-3x mb-3"></i>
                        <p>No videos available at this time.</p>
                    </div>
                `;
            } else {
                const videosHtml = videos.map(video => this.createVideoCard(video)).join('');
                html += `
                    <div class="row">
                        ${videosHtml}
                    </div>
                `;
            }

            container.innerHTML = html;

            // Add click event listeners to video cards if there are videos
            if (videos.length > 0) {
                container.querySelectorAll('.video-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        const videoId = card.dataset.videoId;
                        const video = videos.find(v => v.id === videoId);
                        if (video) {
                            this.showVideoModal(video);
                        }
                    });
                });
            }

        } catch (error) {
            console.error('Error rendering videos:', error);
            html += `
                <div class="text-center text-muted">
                    <i class="fab fa-youtube fa-3x mb-3"></i>
                    <p>Unable to load videos at this time.</p>
                    <small class="text-muted">Error: ${error.message}</small>
                </div>
            `;
            container.innerHTML = html;
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
