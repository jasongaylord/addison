/**
 * Schedule functionality for displaying upcoming tournaments and games
 */

class ScheduleManager {
    constructor() {
        this.scheduleData = null;
    }

    async loadScheduleData() {
        try {
            const response = await fetch('data/schedule.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const textData = await response.text();
            try {
                this.scheduleData = JSON.parse(textData);
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                console.error('Raw JSON text:', textData);
                throw new Error(`Invalid JSON format: ${jsonError.message}`);
            }
            
            return this.scheduleData;
        } catch (error) {
            console.error('Error loading schedule data:', error);
            throw error;
        }
    }

    formatDate(dateString) {
        // Parse date as local time to avoid timezone issues
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day); // month is 0-indexed
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateRange(startDate, endDate) {
        // Parse dates as local time to avoid timezone issues
        const [startYear, startMonth, startDay] = startDate.split('-');
        const [endYear, endMonth, endDay] = endDate.split('-');
        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);
        
        if (start.toDateString() === end.toDateString()) {
            return this.formatDate(startDate);
        }
        
        return `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
    }

    formatTime(timeString) {
        // Convert 24-hour time to 12-hour format if needed
        if (timeString.includes('AM') || timeString.includes('PM')) {
            return timeString;
        }
        
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    isUpcoming(dateString) {
        // Parse date as local time to avoid timezone issues
        const [year, month, day] = dateString.split('-');
        const gameDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return gameDate >= today;
    }

    createTournamentHtml(tournament) {
        const isUpcoming = this.isUpcoming(tournament.startDate);
        if (!isUpcoming) return '';

        const tournamentName = tournament.website 
            ? `<a href="${tournament.website}" target="_blank" class="text-white text-decoration-none">${tournament.name}</a>`
            : tournament.name;

        let gamesHtml = '';
        if (tournament.games && tournament.games.length > 0) {
            const upcomingGames = tournament.games.filter(game => this.isUpcoming(game.date));
            if (upcomingGames.length > 0) {
                gamesHtml = upcomingGames.map((game, index) => {
                    const zebraClass = index % 2 === 0 ? 'bg-light-purple' : 'bg-lighter-purple';
                    const fieldInfo = game.field ? ` - ${game.field}` : '';
                    
                    return `
                        <div class="game-row ${zebraClass} p-3 mb-2 rounded">
                            <div class="row align-items-center">
                                <div class="col-md-3">
                                    <strong>vs ${game.opponent}</strong>
                                </div>
                                <div class="col-md-3">
                                    <i class="fa-solid fa-calendar-days me-2"></i>${this.formatDate(game.date)}
                                </div>
                                <div class="col-md-2">
                                    <i class="fa-solid fa-clock me-2"></i>${this.formatTime(game.time)}
                                </div>
                                <div class="col-md-4">
                                    <i class="fa-solid fa-location-dot me-2"></i>${game.location}${fieldInfo}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        return `
            <div class="tournament-block mb-4">
                <div class="tournament-header bg-dark-purple p-3 rounded-top">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h4 class="mb-1 text-white">
                                <i class="fa-solid fa-trophy me-2"></i>${tournamentName}
                            </h4>
                        </div>
                        <div class="col-md-3">
                            <span class="text-white">
                                <i class="fa-solid fa-calendar-days me-2"></i>${this.formatDateRange(tournament.startDate, tournament.endDate)}
                            </span>
                        </div>
                        <div class="col-md-3">
                            <span class="text-white">
                                <i class="fa-solid fa-location-dot me-2"></i>${tournament.location}
                            </span>
                        </div>
                    </div>
                </div>
                ${gamesHtml ? `<div class="tournament-games">${gamesHtml}</div>` : ''}
            </div>
        `;
    }

    createStandaloneGameHtml(game, index) {
        const isUpcoming = this.isUpcoming(game.date);
        if (!isUpcoming) return '';

        const zebraClass = index % 2 === 0 ? 'bg-light-purple' : 'bg-lighter-purple';
        const fieldInfo = game.field ? ` - ${game.field}` : '';

        return `
            <div class="game-row ${zebraClass} p-3 mb-2 rounded">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <strong>vs ${game.opponent}</strong>
                    </div>
                    <div class="col-md-3">
                        <i class="fa-solid fa-calendar-days me-2"></i>${this.formatDate(game.date)}
                    </div>
                    <div class="col-md-2">
                        <i class="fa-solid fa-clock me-2"></i>${this.formatTime(game.time)}
                    </div>
                    <div class="col-md-4">
                        <i class="fa-solid fa-location-dot me-2"></i>${game.location}${fieldInfo}
                    </div>
                </div>
            </div>
        `;
    }

    async renderSchedule(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Schedule container not found');
                return;
            }

            // Show loading spinner
            container.innerHTML = `
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading schedule...</span>
                    </div>
                </div>
            `;

            if (!this.scheduleData) {
                await this.loadScheduleData();
            }

            let html = '<h2 class="text-white mb-4"><i class="fa-solid fa-calendar-alt me-2"></i>Upcoming Schedule</h2>';

            // Render tournaments
            if (this.scheduleData.tournaments && this.scheduleData.tournaments.length > 0) {
                const tournamentHtml = this.scheduleData.tournaments
                    .map(tournament => this.createTournamentHtml(tournament))
                    .filter(html => html !== '')
                    .join('');
                
                if (tournamentHtml) {
                    html += tournamentHtml;
                }
            }

            // Render standalone games
            if (this.scheduleData.games && this.scheduleData.games.length > 0) {
                const standaloneGames = this.scheduleData.games
                    .map((game, index) => this.createStandaloneGameHtml(game, index))
                    .filter(html => html !== '');

                if (standaloneGames.length > 0) {
                    html += `
                        <div class="standalone-games mb-4">
                            <h5 class="text-white mb-3"><i class="fa-solid fa-baseball me-2"></i>Additional Games</h5>
                            ${standaloneGames.join('')}
                        </div>
                    `;
                }
            }

            // Check if we have any content to display (tournaments or games)
            const hasTournaments = this.scheduleData.tournaments && this.scheduleData.tournaments.some(t => this.isUpcoming(t.startDate));
            const hasGames = this.scheduleData.games && this.scheduleData.games.some(g => this.isUpcoming(g.date));

            // If no upcoming events
            if (!hasTournaments && !hasGames) {
                html += `
                    <div class="text-center text-white">
                        <i class="fa-solid fa-calendar-xmark fa-3x mb-3"></i>
                        <p class="lead">No upcoming tournaments or games scheduled at this time.</p>
                        <p>Check back soon for updates!</p>
                    </div>
                `;
            }

            container.innerHTML = html;

        } catch (error) {
            console.error('Error rendering schedule:', error);
            console.error('Schedule data:', this.scheduleData);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="text-center text-white">
                        <i class="fa-solid fa-exclamation-triangle fa-2x mb-3"></i>
                        <p>Unable to load schedule at this time.</p>
                        <p class="small">Error: ${error.message}</p>
                    </div>
                `;
            }
        }
    }
}

// Initialize schedule manager
const scheduleManager = new ScheduleManager();

// Function to load schedule (called from HTML)
async function loadSchedule(containerId) {
    await scheduleManager.renderSchedule(containerId);
}
