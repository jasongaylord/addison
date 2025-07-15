window.addEventListener('DOMContentLoaded', function() {
    const leaderboardTag = document.getElementById('leaderboard-tag');
    if (leaderboardTag) {
        const words = leaderboardTag.textContent.split(' ');
        if (words.length > 1) {
            words[1] = `<span class="highlight">${words[1]}</span>`;
            leaderboardTag.innerHTML = words.join(' ');
        }
    }
});