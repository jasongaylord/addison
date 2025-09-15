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

            // Always try to load saved videos from server first
            const savedVideos = await this.loadSavedVideosFromServer();
            if (savedVideos && savedVideos.length > 0) {
                console.log('📼 Using saved videos from server (', savedVideos.length, 'videos)');
                return savedVideos;
            }

            // If no saved videos, try to fetch from API
            const channelId = this.settings.youtube.channelId;
            const maxVideos = this.settings.youtube.maxVideos || 8;
            const apiKey = this.settings.api.youtubeApiKey;

            if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
                console.warn('YouTube API key not configured. Using mock data.');
                return this.getMockVideos();
            }

            console.log('🔄 Fetching videos from YouTube API...');

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

            console.log('✅ Fetched', this.videos.length, 'videos from YouTube API');
            console.log('💡 To make these your permanent videos, run: YouTubeVideos.saveCurrentAsDefault()');

            return this.videos;
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            // Fallback to saved videos from server, then mock data
            const savedVideos = await this.loadSavedVideosFromServer();
            if (savedVideos && savedVideos.length > 0) {
                console.log('📼 Falling back to saved videos from server');
                return savedVideos;
            }
            return this.getMockVideos();
        }
    }

    // Load saved videos from server (data/youtube-videos.json)
    async loadSavedVideosFromServer() {
        try {
            const response = await fetch('data/youtube-videos.json');
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('📭 No saved videos file found on server');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('� Loaded saved videos from server:', data.savedAt);
            return data.videos || null;
        } catch (error) {
            console.warn('Could not load saved videos from server:', error);
            return null;
        }
    }

    // Generate JSON content for saved videos (to be manually saved to server)
    generateSavedVideosJSON(videos) {
        const saveData = {
            videos: videos,
            savedAt: new Date().toISOString(),
            channelId: this.settings?.youtube?.channelId,
            source: 'manual_save',
            note: 'This file contains the curated YouTube videos displayed on the website. All visitors will see these videos.'
        };
        return JSON.stringify(saveData, null, 2);
    }

    // Save videos as default (generates file content for manual server upload)
    saveVideosAsDefault(videos) {
        try {
            const jsonContent = this.generateSavedVideosJSON(videos);
            
            // Create downloadable file
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'youtube-videos.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('💾 Generated youtube-videos.json file for download');
            console.log('� Upload this file to your /data/ folder on the server');
            console.log('📋 Videos to be saved:', videos.map(v => v.title));
            console.log('📄 File content preview:');
            console.log(jsonContent);
            
            return true;
        } catch (error) {
            console.error('Could not generate saved videos file:', error);
            return false;
        }
    }

    // Get info about saved videos from server
    async getSavedVideoInfo() {
        try {
            const response = await fetch('data/youtube-videos.json');
            if (!response.ok) {
                return { hasSaved: false, message: 'No saved videos file on server' };
            }
            const data = await response.json();
            return {
                hasSaved: true,
                videoCount: data.videos?.length || 0,
                savedAt: data.savedAt,
                channelId: data.channelId,
                videos: data.videos?.map(v => ({ id: v.id, title: v.title })) || []
            };
        } catch (error) {
            console.warn('Could not get saved video info:', error);
            return { hasSaved: false, error: error.message };
        }
    }

    // Save videos to localStorage for offline/fallback use
    saveCachedVideos(videos) {
        try {
            const cacheData = {
                videos: videos,
                timestamp: new Date().toISOString(),
                channelId: this.settings?.youtube?.channelId
            };
            localStorage.setItem('youtube_video_cache', JSON.stringify(cacheData));
            console.log('✅ Cached', videos.length, 'videos for offline use');
        } catch (error) {
            console.warn('Could not save video cache:', error);
        }
    }

    // Load cached videos or fall back to mock data
    getCachedVideos() {
        try {
            const cacheData = localStorage.getItem('youtube_video_cache');
            if (cacheData) {
                const parsed = JSON.parse(cacheData);
                console.log('📦 Using cached videos from:', parsed.timestamp);
                return parsed.videos || this.getMockVideos();
            }
        } catch (error) {
            console.warn('Could not load cached videos:', error);
        }
        
        // Final fallback to mock data
        return this.getMockVideos();
    }

    // Clear the video cache (useful for forcing fresh fetch)
    clearVideoCache() {
        try {
            localStorage.removeItem('youtube_video_cache');
            console.log('🗑️ Video cache cleared');
            return true;
        } catch (error) {
            console.warn('Could not clear video cache:', error);
            return false;
        }
    }

    // Get cache info for debugging
    getCacheInfo() {
        try {
            const cacheData = localStorage.getItem('youtube_video_cache');
            if (cacheData) {
                const parsed = JSON.parse(cacheData);
                return {
                    hasCache: true,
                    videoCount: parsed.videos?.length || 0,
                    timestamp: parsed.timestamp,
                    channelId: parsed.channelId
                };
            }
        } catch (error) {
            console.warn('Could not get cache info:', error);
        }
        
        return { hasCache: false };
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

// Global utility functions for managing videos
window.YouTubeVideos = {
    // Save the currently displayed videos as the permanent defaults for all users
    async saveCurrentAsDefault() {
        const manager = new YouTubeManager();
        try {
            // Get the current videos (either from API or server)
            const currentVideos = await manager.fetchChannelVideos();
            
            if (currentVideos && currentVideos.length > 0) {
                manager.saveVideosAsDefault(currentVideos);
                console.log('✅ Generated youtube-videos.json file for server upload!');
                console.log('� Upload the downloaded file to your /data/ folder');
                console.log('🌍 Once uploaded, ALL visitors will see these videos');
                return currentVideos;
            } else {
                console.log('❌ No videos found to save');
                return null;
            }
        } catch (error) {
            console.error('Failed to save current videos:', error);
            return null;
        }
    },
    
    // Force fetch fresh videos from YouTube API (ignoring saved videos)
    async fetchFreshFromAPI() {
        const manager = new YouTubeManager();
        try {
            await manager.loadSettings();
            
            const channelId = manager.settings.youtube.channelId;
            const maxVideos = manager.settings.youtube.maxVideos || 8;
            const apiKey = manager.settings.api.youtubeApiKey;

            if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
                console.log('❌ YouTube API key not configured');
                return null;
            }

            console.log('🔄 Fetching fresh videos directly from YouTube API...');

            // Fetch directly from API, bypassing any saved videos
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
            );

            if (!channelResponse.ok) {
                throw new Error(`Channel API error! status: ${channelResponse.status}`);
            }

            const channelData = await channelResponse.json();
            const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

            const videosResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxVideos}&order=date&key=${apiKey}`
            );

            if (!videosResponse.ok) {
                throw new Error(`Videos API error! status: ${videosResponse.status}`);
            }

            const videosData = await videosResponse.json();
            
            const videos = videosData.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
                publishedAt: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle
            }));
            
            console.log('🆕 Fetched', videos.length, 'fresh videos from YouTube API');
            console.log('💡 To make these your new defaults, run: YouTubeVideos.saveCurrentAsDefault()');
            
            return videos;
        } catch (error) {
            console.error('Failed to fetch fresh videos:', error);
            return null;
        }
    },
    
    // Check if there are saved videos on the server
    async checkServerVideos() {
        const manager = new YouTubeManager();
        const info = await manager.getSavedVideoInfo();
        
        if (info.hasSaved) {
            console.log('🌍 Server has', info.videoCount, 'saved videos from', info.savedAt);
            console.log('📋 Saved videos:', info.videos);
            console.log('📁 File location: /data/youtube-videos.json');
        } else {
            console.log('📭 No saved videos on server - will fetch from API each time');
            if (info.error) {
                console.log('❌ Error:', info.error);
            }
        }
        
        return info;
    },
    
    // Remove saved videos from server (you'll need to manually delete the file)
    removeServerVideos() {
        console.log('�️ To remove saved videos:');
        console.log('1. Delete /data/youtube-videos.json from your server');
        console.log('2. The site will then fetch fresh videos from YouTube API');
        console.log('📁 File to delete: /data/youtube-videos.json');
    },
    
    // Download current server videos as backup
    async downloadServerVideos() {
        try {
            const response = await fetch('data/youtube-videos.json');
            if (!response.ok) {
                console.log('📭 No videos file on server to download');
                return null;
            }
            
            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'youtube-videos-backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('� Downloaded server videos as backup');
            return data.videos;
        } catch (error) {
            console.error('Failed to download server videos:', error);
            return null;
        }
    }
};
