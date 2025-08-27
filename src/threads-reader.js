/**
 * Threads Account Reader
 * Fetches the latest 8 posts from a Threads account using the official Threads API
 * 
 * Uses the official Threads API documented at:
 * https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts
 */

class ThreadsReader {
    constructor(username = 'agaylord_2027', accessToken = null) {
        this.username = username;
        this.accessToken = accessToken;
        this.baseUrl = 'https://graph.threads.net/v1.0';
        this.maxPosts = 8;
    }

    /**
     * Method 1: Using official Threads API for public profiles
     * Requires threads_basic and threads_profile_discovery permissions
     */
    async fetchPostsFromAPI() {
        try {
            if (!this.accessToken) {
                console.warn('No access token provided. Using mock data for development.');
                return [];
            }

            // Use the profile_posts endpoint for public profiles
            const apiUrl = `${this.baseUrl}/profile_posts`;
            const params = new URLSearchParams({
                username: this.username,
                fields: 'id,media_product_type,media_type,media_url,permalink,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post',
                limit: this.maxPosts,
                access_token: this.accessToken
            });

            const response = await fetch(`${apiUrl}?${params}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return this.formatPosts(data.data || []);
        } catch (error) {
            console.error('Error fetching from Threads API:', error);
            return [];
        }
    }

    /**
     * Method 2: Using Threads API for app-scoped users (if the user is authenticated with your app)
     * Requires threads_basic permission
     */
    async fetchUserThreads(userId = 'me') {
        try {
            if (!this.accessToken) {
                console.warn('No access token provided. Cannot fetch user threads.');
                return [];
            }

            const apiUrl = `${this.baseUrl}/${userId}/threads`;
            const params = new URLSearchParams({
                fields: 'id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post',
                limit: this.maxPosts,
                access_token: this.accessToken
            });

            const response = await fetch(`${apiUrl}?${params}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return this.formatPosts(data.data || []);
        } catch (error) {
            console.error('Error fetching user threads:', error);
            return [];
        }
    }

    /**
     * Method 3: Fetch a single thread by ID
     */
    async fetchSingleThread(threadId) {
        try {
            if (!this.accessToken) {
                console.warn('No access token provided. Cannot fetch single thread.');
                return null;
            }

            const apiUrl = `${this.baseUrl}/${threadId}`;
            const params = new URLSearchParams({
                fields: 'id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post',
                access_token: this.accessToken
            });

            const response = await fetch(`${apiUrl}?${params}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return this.formatPost(data);
        } catch (error) {
            console.error('Error fetching single thread:', error);
            return null;
        }
    }

    /**
     * Fallback method: Generate mock data for development and testing
     * This provides realistic data when API access isn't available
     */
    async fetchMockData() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockPosts = [
            {
                id: '1',
                text: 'Great practice today! Working on my batting stance and it\'s really paying off. Ready for the upcoming season! 🥎⚾',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '2', 
                text: 'Team bonding at the park! Love spending time with my teammates off the field too. #TeamWork #SoftballLife',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '3',
                text: 'Just finished an amazing workout session. Strength training is key for power hitting! 💪',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '4',
                text: 'Studying game film from last week. Always looking for ways to improve my defense and base running.',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '5',
                text: 'Grateful for all the support from family and coaches. Couldn\'t do this without them! 🙏',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '6',
                text: 'Morning run complete! Cardio is so important for stamina during those long games.',
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '7',
                text: 'Excited about the recruiting process! Dreams are becoming reality step by step. 🎓⚾',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            },
            {
                id: '8',
                text: 'Perfect weather for outdoor practice today. Nothing beats playing under the blue sky! ☀️',
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
                media_type: 'TEXT',
                permalink: '#',
                username: this.username
            }
        ];

        return mockPosts.slice(0, this.maxPosts);
    }

    /**
     * Format posts from API response to standardized format
     */
    formatPosts(posts) {
        return posts.map(post => this.formatPost(post));
    }

    /**
     * Format a single post from API response
     */
    formatPost(post) {
        return {
            id: post.id,
            text: post.text || '',
            timestamp: post.timestamp,
            media_type: post.media_type || 'TEXT',
            media_url: post.media_url || null,
            thumbnail_url: post.thumbnail_url || null,
            permalink: post.permalink || '#',
            username: post.username || this.username,
            shortcode: post.shortcode || null,
            is_quote_post: post.is_quote_post || false
        };
    }

    /**
     * Main method to fetch posts - tries API first, falls back to mock data
     */
    async fetchPosts() {
        try {
            // Try to initialize with app token if no token is set
            if (!this.accessToken) {
                await this.initializeWithAppToken();
            }

            // Try the official API first
            let posts = await this.fetchPostsFromAPI();
            
            // If no posts from API (no access token), try user threads
            if (posts.length === 0 && this.accessToken) {
                posts = await this.fetchUserThreads();
            }
            
            // Fall back to mock data for development
            if (posts.length === 0) {
                if (!this.accessToken) {
                    console.log('No access token available. Using mock data for development.');
                } else {
                    console.log('API calls failed. Using mock data as fallback.');
                }
                posts = await this.fetchMockData();
            }

            return posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Return mock data as final fallback
            return await this.fetchMockData();
        }
    }

    /**
     * Generate time ago string from timestamp
     */
    getTimeAgo(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postTime) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    }

    /**
     * Render posts as HTML
     */
    renderPostsHTML(posts) {
        if (!posts || posts.length === 0) {
            return '<p class="text-muted text-center">No posts available</p>';
        }

        return posts.map(post => {
            const timeAgo = this.getTimeAgo(post.timestamp);
            const mediaHtml = post.media_url ? 
                `<img src="${post.media_url}" alt="Post media" class="img-fluid mt-2 rounded">` : '';
            const thumbnailHtml = post.thumbnail_url && !post.media_url ? 
                `<img src="${post.thumbnail_url}" alt="Post thumbnail" class="img-fluid mt-2 rounded">` : '';

            return `
                <div class="col-12 col-lg-6 col-xl-3 mb-3">
                    <a href="${post.permalink}" target="_blank" class="text-decoration-none">
                        <div class="card h-100 rounded-3 shadow-sm threads-card">
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="d-flex align-items-center">
                                        <i class="fab fa-threads text-primary me-2"></i>
                                        <strong class="text-white">@${post.username}</strong>
                                    </div>
                                    <span class="ms-auto small" style="color: #8E44AD;">${timeAgo}</span>
                                </div>
                                <p class="card-text text-white mb-3 flex-grow-1">${post.text}</p>
                                ${mediaHtml}
                                ${thumbnailHtml}
                                <div class="mt-auto pt-2">
                                    <small class="text-muted">
                                        <i class="far fa-clock me-1"></i>
                                        ${new Date(post.timestamp).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
    }

    /**
     * Set access token for API authentication
     */
    setAccessToken(token) {
        this.accessToken = token;
    }

    /**
     * Check if API is configured (has access token)
     */
    isConfigured() {
        return !!this.accessToken;
    }

    /**
     * Load app access token from data/threads.json file
     * This method reads the automatically refreshed token from GitHub Actions
     */
    async loadAppAccessToken() {
        try {
            const response = await fetch('./data/threads.json');
            
            if (!response.ok) {
                console.warn('Could not load app access token from data/threads.json');
                return null;
            }

            const appData = await response.json();
            
            // Validate token exists and is not null
            if (appData.access_token && appData.access_token !== null) {
                // Check if token is expired (older than configured days)
                if (appData.generated_at) {
                    const generatedDate = new Date(appData.generated_at);
                    const expiryDays = appData.expires_in_days || 30;
                    const expiryDate = new Date(generatedDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
                    
                    if (new Date() > expiryDate) {
                        console.warn('App access token has expired. Waiting for automatic refresh...');
                        return null;
                    }
                }
                
                console.log('Successfully loaded app access token from data/threads.json');
                return appData.access_token;
            } else {
                console.warn('No valid access token found in data/threads.json');
                return null;
            }
        } catch (error) {
            console.error('Error loading app access token:', error);
            return null;
        }
    }

    /**
     * Initialize with app access token from file if no token is provided
     */
    async initializeWithAppToken() {
        if (!this.accessToken) {
            const appToken = await this.loadAppAccessToken();
            if (appToken) {
                this.setAccessToken(appToken);
                console.log('Initialized with app access token from data/threads.json');
                return true;
            }
        }
        return false;
    }
}

// Usage Examples and Documentation:

/**
 * How to use the ThreadsReader class:
 * 
 * 1. For development (using mock data):
 *    const reader = new ThreadsReader('agaylord_2027');
 *    const posts = await reader.fetchPosts();
 * 
 * 2. For production with manual API access:
 *    const reader = new ThreadsReader('agaylord_2027', 'YOUR_ACCESS_TOKEN');
 *    const posts = await reader.fetchPosts();
 * 
 * 3. For production with auto-loaded app token (recommended):
 *    const reader = new ThreadsReader('agaylord_2027');
 *    const posts = await reader.fetchPosts(); // Automatically loads from data/threads.json
 * 
 * 4. Set access token later:
 *    const reader = new ThreadsReader('agaylord_2027');
 *    reader.setAccessToken('YOUR_ACCESS_TOKEN');
 *    const posts = await reader.fetchPosts();
 * 
 * 5. Manually load app token:
 *    const reader = new ThreadsReader('agaylord_2027');
 *    await reader.initializeWithAppToken();
 *    const posts = await reader.fetchPosts();
 * 
 * App Access Token Management:
 * - Tokens are automatically refreshed every 30 days via GitHub Actions
 * - Stored in data/threads.json with expiration tracking
 * - Automatically loaded when fetchPosts() is called without a token
 * - Fallback to mock data if token is unavailable or expired
 * 
 * API Requirements:
 * - Access token with threads_basic permission for user's own threads
 * - Access token with threads_profile_discovery permission for public profiles
 * - Public profiles must have 18+ years and 1000+ followers
 * - Rate limit: 1000 requests per 24 hours
 * 
 * Available fields from API:
 * - id: Thread ID
 * - media_product_type: Always "THREADS"
 * - media_type: TEXT, IMAGE, VIDEO, CAROUSEL_ALBUM
 * - media_url: URL to media file
 * - permalink: URL to thread
 * - owner: Owner information (for user threads)
 * - username: Username of poster
 * - text: Text content of the thread
 * - timestamp: ISO 8601 formatted creation time
 * - shortcode: Thread shortcode
 * - thumbnail_url: Thumbnail for videos
 * - children: Child threads for carousel albums
 * - is_quote_post: Whether this is a quote post
 */

// Initialize the reader for development (will use mock data)
const threadsReader = new ThreadsReader('agaylord_2027');

// Example function to load posts and render them
async function loadThreadsPosts(containerId = 'threads-posts') {
    try {
        const posts = await threadsReader.fetchPosts();
        const container = document.getElementById(containerId);
        
        if (container) {
            container.innerHTML = `
                <div class="threads-feed">
                    <div class="text-center mb-4">
                        <h2 class="display-6 fw-bold mb-2">
                            <i class="fab fa-threads text-primary"></i> 
                            Latest from Threads
                        </h2>
                        <p class="text-muted">Follow @${threadsReader.username} for updates</p>
                    </div>
                    <div class="row">
                        ${threadsReader.renderPostsHTML(posts)}
                    </div>
                </div>
            `;
        }
        
        return posts;
    } catch (error) {
        console.error('Error loading Threads posts:', error);
        return [];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThreadsReader, loadThreadsPosts };
}
