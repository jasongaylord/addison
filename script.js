window.addEventListener('DOMContentLoaded', function() {
    const leaderboardTag = document.getElementById('leaderboard-tag');
    if (leaderboardTag) {
        const words = leaderboardTag.textContent.split(' ');
        if (words.length > 2) {
            words[2] = `<span class="highlight">${words[2]}</span>`;
            leaderboardTag.innerHTML = words.join(' ');
        }
    }
});