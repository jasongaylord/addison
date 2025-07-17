// Strongly typed classes for JSON data
class GameStats {
    constructor(data) {
        this.opponent = data.opponent || '';
        this.date = data.date || '';
        this.location = data.location || '';
        this.ab = data.ab || 0;           // At bats
        this.r = data.r || 0;             // Runs
        this.h = data.h || 0;             // Hits
        this.rbi = data.rbi || 0;         // Runs batted in
        this.bb = data.bb || 0;           // Walks
        this.so = data.so || 0;           // Strikeouts
        this.doubles = data['2b'] || 0;   // Doubles
        this.triples = data['3b'] || 0;   // Triples
        this.hr = data.hr || 0;           // Home runs
        this.gs = data.gs || 0;           // Grand slams
        this.sb = data.sb || 0;           // Stolen bases
        this.cs = data.cs || 0;           // Caught stealing
        this.hbp = data.hbp || 0;         // Hit by pitch
        this.e = data.e || 0;             // Errors
        this.a = data.a || data.assists || 0; // Assists (support both old and new property names)
        this.po = data.po || data.putouts || 0; // Put outs
        this.dp = data.dp || data.double_plays || 0; // Double plays
        this.tp = data.tp || data.triple_plays || 0; // Triple plays
        this.inn = data.inn || 0;         // Innings caught
        this.pb = data.pb || 0;           // Passed balls
        this.sba = data.sba || 0;         // Stolen bases allowed
        this.rcs = data.rcs || 0;         // Runners caught stealing
        this.pik = data.pik || 0;         // Runners picked off
        this.gameResult = data.game_result || '';
    }

    // Calculate batting average for this game
    getBattingAverage() {
        return this.ab > 0 ? (this.h / this.ab).toFixed(3) : '0.000';
    }

    // Calculate on-base percentage for this game
    getOnBasePercentage() {
        const plateAppearances = this.ab + this.bb + this.hbp;
        return plateAppearances > 0 ? 
            ((this.h + this.bb + this.hbp) / plateAppearances).toFixed(3) : '0.000';
    }

    // Calculate fielding percentage for this game
    getFieldingPercentage() {
        const totalChances = this.a + this.po + this.e;
        return totalChances > 0 ? 
            ((this.a + this.po) / totalChances).toFixed(3) : '1.000';
    }

    // Calculate runners caught stealing percentage for this game
    getRunnersCaughtStealingPercentage() {
        const totalAttempts = this.sba + this.rcs;
        return totalAttempts > 0 ? ((this.rcs / totalAttempts) * 100).toFixed(1) : '0.0';
    }

    // Check if game was won
    isWin() {
        return this.gameResult.startsWith('W');
    }
}

class SeasonStats {
    constructor(data) {
        this.team = data.team || '';
        this.season = data.season || '';
        this.games = data.games ? data.games.map(game => new GameStats(game)) : [];
    }

    // Calculate season totals
    getSeasonTotals() {
        return this.games.reduce((totals, game) => {
            totals.ab += game.ab;
            totals.r += game.r;
            totals.h += game.h;
            totals.rbi += game.rbi;
            totals.bb += game.bb;
            totals.so += game.so;
            totals.doubles += game.doubles;
            totals.triples += game.triples;
            totals.hr += game.hr;
            totals.gs += game.gs;
            totals.sb += game.sb;
            totals.cs += game.cs;
            totals.hbp += game.hbp;
            totals.e += game.e;
            totals.a += game.a;
            totals.po += game.po;
            totals.dp += game.dp;
            totals.tp += game.tp;
            totals.inn += game.inn;
            totals.pb += game.pb;
            totals.sba += game.sba;
            totals.rcs += game.rcs;
            totals.pik += game.pik;
            totals.wins += game.isWin() ? 1 : 0;
            totals.losses += !game.isWin() ? 1 : 0;
            return totals;
        }, {
            ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0,
            doubles: 0, triples: 0, hr: 0, gs: 0, sb: 0, cs: 0,
            hbp: 0, e: 0, a: 0, po: 0, dp: 0, tp: 0,
            inn: 0, pb: 0, sba: 0, rcs: 0, pik: 0,
            wins: 0, losses: 0
        });
    }

    // Calculate season batting average
    getSeasonBattingAverage() {
        const totals = this.getSeasonTotals();
        return totals.ab > 0 ? (totals.h / totals.ab).toFixed(3) : '0.000';
    }

    // Calculate season on-base percentage
    getSeasonOnBasePercentage() {
        const totals = this.getSeasonTotals();
        const plateAppearances = totals.ab + totals.bb + totals.hbp;
        return plateAppearances > 0 ? 
            ((totals.h + totals.bb + totals.hbp) / plateAppearances).toFixed(3) : '0.000';
    }

    // Calculate season slugging percentage
    getSeasonSluggingPercentage() {
        const totals = this.getSeasonTotals();
        if (totals.ab === 0) return '0.000';
        
        const totalBases = totals.h + totals.doubles + (totals.triples * 2) + (totals.hr * 3);
        return (totalBases / totals.ab).toFixed(3);
    }

    // Calculate strikeouts per plate appearance
    getStrikeoutsPerPlateAppearance() {
        const totals = this.getSeasonTotals();
        const plateAppearances = totals.ab + totals.bb + totals.hbp;
        return plateAppearances > 0 ? (totals.so / plateAppearances).toFixed(3) : '0.000';
    }

    // Calculate walks per plate appearance
    getWalksPerPlateAppearance() {
        const totals = this.getSeasonTotals();
        const plateAppearances = totals.ab + totals.bb + totals.hbp;
        return plateAppearances > 0 ? (totals.bb / plateAppearances).toFixed(3) : '0.000';
    }

    // Calculate season fielding percentage
    getSeasonFieldingPercentage() {
        const totals = this.getSeasonTotals();
        const totalChances = totals.a + totals.po + totals.e;
        return totalChances > 0 ? 
            ((totals.a + totals.po) / totalChances).toFixed(3) : '1.000';
    }

    // Calculate season runners caught stealing percentage
    getSeasonRunnersCaughtStealingPercentage() {
        const totals = this.getSeasonTotals();
        const totalAttempts = totals.sba + totals.rcs;
        return totalAttempts > 0 ? ((totals.rcs / totalAttempts) * 100).toFixed(1) : '0.0';
    }

    // Calculate stealing percentage
    getStealingPercentage() {
        const totals = this.getSeasonTotals();
        const stealingAttempts = totals.sb + totals.cs;
        return stealingAttempts > 0 ? ((totals.sb / stealingAttempts) * 100).toFixed(1) : '0.0';
    }

    // Get games count
    getGamesPlayed() {
        return this.games.length;
    }
}

// Function to load JSON files from data folder
async function loadJsonData(filename) {
    try {
        const response = await fetch(`data/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }
        const data = await response.json();
        return new SeasonStats(data);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        // Fallback to embedded data if fetch fails
        return loadEmbeddedData(filename);
    }
}

// Fallback function with embedded data
function loadEmbeddedData(filename) {
    const embeddedData = {
        '2025.json': {
            "team": "PA Outlaws 18U National Cole",
            "season": "Summer 2025",
            "games": [
                {
                    "opponent": "NJ Stars Fastpitch Prosser 18U",
                    "date": "6/1/2025 10:15am",
                    "location": "Lancaster, PA",
                    "ab": 3,
                    "r": 0,
                    "h": 1,
                    "rbi": 1,
                    "bb": 0,
                    "so": 0,
                    "2b": 0,
                    "3b": 0,
                    "hr": 0,
                    "gs": 0,
                    "sb": 0,
                    "cs": 0,
                    "hbp": 0,
                    "e": 0,
                    "a": 2,
                    "po": 3,
                    "dp": 1,
                    "tp": 0,
                    "inn": 5,
                    "pb": 0,
                    "sba": 2,
                    "rcs": 1,
                    "pik": 0,
                    "game_result": "W 5-0"
                },
                {
                    "opponent": "Mystics National GarrettDunlap 16U",
                    "date": "6/1/2025 1:45pm",
                    "location": "Lancaster, PA",
                    "ab": 1,
                    "r": 1,
                    "h": 1,
                    "rbi": 0,
                    "bb": 1,
                    "so": 0,
                    "2b": 0,
                    "3b": 0,
                    "hr": 0,
                    "gs": 0,
                    "sb": 1,
                    "cs": 0,
                    "hbp": 0,
                    "e": 0,
                    "a": 1,
                    "po": 2,
                    "dp": 0,
                    "tp": 0,
                    "inn": 4,
                    "pb": 1,
                    "sba": 3,
                    "rcs": 0,
                    "pik": 1,
                    "game_result": "L 4-12"
                },
                {
                    "opponent": "Pennsbury Gems National 18U",
                    "date": "6/8/2025 8:00am",
                    "location": "Adventure Park, NJ",
                    "ab": 2,
                    "r": 0,
                    "h": 0,
                    "rbi": 0,
                    "bb": 1,
                    "so": 2,
                    "2b": 0,
                    "3b": 0,
                    "hr": 0,
                    "gs": 0,
                    "sb": 1,
                    "cs": 0,
                    "hbp": 0,
                    "e": 0,
                    "a": 3,
                    "po": 1,
                    "dp": 0,
                    "tp": 0,
                    "inn": 7,
                    "pb": 0,
                    "sba": 1,
                    "rcs": 2,
                    "pik": 0,
                    "game_result": "L 1-5"
                },
                {
                    "opponent": "Rock Gold Waye - Mahony 18U",
                    "date": "6/8/2025 11:20am",
                    "location": "Adventure Park, NJ",
                    "ab": 2,
                    "r": 0,
                    "h": 0,
                    "rbi": 0,
                    "bb": 0,
                    "so": 0,
                    "2b": 0,
                    "3b": 0,
                    "hr": 0,
                    "gs": 0,
                    "sb": 0,
                    "cs": 0,
                    "hbp": 0,
                    "e": 1,
                    "a": 0,
                    "po": 4,
                    "dp": 0,
                    "tp": 0,
                    "game_result": "L 0-13"
                }
            ]
        }
    };
    
    if (embeddedData[filename]) {
        return new SeasonStats(embeddedData[filename]);
    }
    return null;
}

// Function to load all JSON files from data folder
async function loadAllSeasonData() {
    const dataFiles = ['2025.json', '2024.json', '2023.json']; // Add more files as needed
    const seasonData = {};
    
    for (const filename of dataFiles) {
        const seasonStats = await loadJsonData(filename);
        if (seasonStats) {
            const year = filename.replace('.json', '');
            seasonData[year] = seasonStats;
            console.log(`Loaded ${year} season data:`, seasonStats);
        }
    }
    
    return seasonData;
}

// Function to calculate career totals from all seasons
function calculateCareerTotals(allSeasonData) {
    const careerTotals = {
        ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0,
        doubles: 0, triples: 0, hr: 0, gs: 0, sb: 0, cs: 0,
        hbp: 0, e: 0, a: 0, po: 0, dp: 0, tp: 0,
        inn: 0, pb: 0, sba: 0, rcs: 0, pik: 0,
        wins: 0, losses: 0, games: 0
    };
    
    Object.values(allSeasonData).forEach(seasonStats => {
        const seasonTotals = seasonStats.getSeasonTotals();
        careerTotals.ab += seasonTotals.ab;
        careerTotals.r += seasonTotals.r;
        careerTotals.h += seasonTotals.h;
        careerTotals.rbi += seasonTotals.rbi;
        careerTotals.bb += seasonTotals.bb;
        careerTotals.so += seasonTotals.so;
        careerTotals.doubles += seasonTotals.doubles;
        careerTotals.triples += seasonTotals.triples;
        careerTotals.hr += seasonTotals.hr;
        careerTotals.gs += seasonTotals.gs;
        careerTotals.sb += seasonTotals.sb;
        careerTotals.cs += seasonTotals.cs;
        careerTotals.hbp += seasonTotals.hbp;
        careerTotals.e += seasonTotals.e;
        careerTotals.a += seasonTotals.a;
        careerTotals.po += seasonTotals.po;
        careerTotals.dp += seasonTotals.dp;
        careerTotals.tp += seasonTotals.tp;
        careerTotals.inn += seasonTotals.inn;
        careerTotals.pb += seasonTotals.pb;
        careerTotals.sba += seasonTotals.sba;
        careerTotals.rcs += seasonTotals.rcs;
        careerTotals.pik += seasonTotals.pik;
        careerTotals.wins += seasonTotals.wins;
        careerTotals.losses += seasonTotals.losses;
        careerTotals.games += seasonStats.getGamesPlayed();
    });
    
    return careerTotals;
}

// Function to calculate career batting average
function calculateCareerBattingAverage(careerTotals) {
    return careerTotals.ab > 0 ? (careerTotals.h / careerTotals.ab).toFixed(3) : '0.000';
}

// Function to calculate career on-base percentage
function calculateCareerOnBasePercentage(careerTotals) {
    const plateAppearances = careerTotals.ab + careerTotals.bb + careerTotals.hbp;
    return plateAppearances > 0 ? 
        ((careerTotals.h + careerTotals.bb + careerTotals.hbp) / plateAppearances).toFixed(3) : '0.000';
}

// Function to calculate career slugging percentage
function calculateCareerSluggingPercentage(careerTotals) {
    if (careerTotals.ab === 0) return '0.000';
    const totalBases = careerTotals.h + careerTotals.doubles + (careerTotals.triples * 2) + (careerTotals.hr * 3);
    return (totalBases / careerTotals.ab).toFixed(3);
}

// Function to calculate career strikeouts per plate appearance
function calculateCareerStrikeoutsPerPA(careerTotals) {
    const plateAppearances = careerTotals.ab + careerTotals.bb + careerTotals.hbp;
    return plateAppearances > 0 ? (careerTotals.so / plateAppearances).toFixed(3) : '0.000';
}

// Function to calculate career walks per plate appearance
function calculateCareerWalksPerPA(careerTotals) {
    const plateAppearances = careerTotals.ab + careerTotals.bb + careerTotals.hbp;
    return plateAppearances > 0 ? (careerTotals.bb / plateAppearances).toFixed(3) : '0.000';
}

// Function to calculate career stealing percentage
function calculateCareerStealingPercentage(careerTotals) {
    const stealingAttempts = careerTotals.sb + careerTotals.cs;
    return stealingAttempts > 0 ? ((careerTotals.sb / stealingAttempts) * 100).toFixed(1) : '0.0';
}

// Function to calculate career fielding percentage
function calculateCareerFieldingPercentage(careerTotals) {
    const totalChances = careerTotals.a + careerTotals.po + careerTotals.e;
    return totalChances > 0 ? 
        ((careerTotals.a + careerTotals.po) / totalChances).toFixed(3) : '1.000';
}

// Function to calculate career runners caught stealing percentage
function calculateCareerRunnersCaughtStealingPercentage(careerTotals) {
    const totalAttempts = careerTotals.sba + careerTotals.rcs;
    return totalAttempts > 0 ? ((careerTotals.rcs / totalAttempts) * 100).toFixed(1) : '0.0';
}

// Function to populate statistics section in index.html
function populateIndexStatistics(allSeasonData) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    let html = '';
    
    // Check if we have any season data
    const seasons = Object.keys(allSeasonData);
    if (seasons.length === 0) {
        html = '<div class="alert alert-info">No season data available.</div>';
    } else {
        // Calculate career totals
        const careerTotals = calculateCareerTotals(allSeasonData);
        
        // Create career summary cards
        html += `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">Batting Average</h5>
                                    <h2 class="text-primary">${calculateCareerBattingAverage(careerTotals)}</h2>
                                    <p class="card-text">${careerTotals.h} hits in ${careerTotals.ab} at-bats</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">On-Base Percentage</h5>
                                    <h2 class="text-primary">${calculateCareerOnBasePercentage(careerTotals)}</h2>
                                    <p class="card-text">${careerTotals.ab + careerTotals.bb + careerTotals.hbp} plate appearances</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">Slugging Percentage</h5>
                                    <h2 class="text-primary">${calculateCareerSluggingPercentage(careerTotals)}</h2>
                                    <p class="card-text">${careerTotals.doubles} 2B, ${careerTotals.triples} 3B, ${careerTotals.hr} HR</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">Fielding Percentage</h5>
                                    <h2 class="text-primary">${calculateCareerFieldingPercentage(careerTotals)}</h2>
                                    <p class="card-text">${careerTotals.a + careerTotals.po} chances, ${careerTotals.e} errors</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">Stealing Percentage</h5>
                                    <h2 class="text-primary">${calculateCareerStealingPercentage(careerTotals)}%</h2>
                                    <p class="card-text">${careerTotals.sb} stolen bases, ${careerTotals.cs} caught stealing</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">CS% (Catching)</h5>
                                    <h2 class="text-primary">${calculateCareerRunnersCaughtStealingPercentage(careerTotals)}%</h2>
                                    <p class="card-text">${careerTotals.rcs} caught, ${careerTotals.sba} allowed</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">Strikeouts per PA</h5>
                                    <h2 class="text-primary">${calculateCareerStrikeoutsPerPA(careerTotals)}</h2>
                                    <p class="card-text">${careerTotals.so} strikeouts</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <h5 class="card-title">Walks per PA</h5>
                                    <h2 class="text-primary">${calculateCareerWalksPerPA(careerTotals)}</h2>
                                    <p class="card-text">${careerTotals.bb} walks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Create season/team statistics grid
        html += `
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Season</th>
                                    <th>Team</th>
                                    <th>GP</th>
                                    <th>AVG</th>
                                    <th>OBP</th>
                                    <th>SLG</th>
                                    <th>FLD%</th>
                                    <th>AB</th>
                                    <th>H</th>
                                    <th>R</th>
                                    <th>RBI</th>
                                    <th>2B</th>
                                    <th>3B</th>
                                    <th>HR</th>
                                    <th>BB</th>
                                    <th>SO</th>
                                    <th>SB</th>
                                    <th>CS</th>
                                    <th>A</th>
                                    <th>PO</th>
                                    <th>E</th>
                                    <th>DP</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        // Add each season's data
        seasons.forEach(year => {
            const seasonStats = allSeasonData[year];
            const totals = seasonStats.getSeasonTotals();
            
            html += `
                <tr>
                    <td><strong>${year}</strong></td>
                    <td><a onclick="showGameDetails('${year}')">${seasonStats.team}</a></td>
                    <td>${seasonStats.getGamesPlayed()}</td>
                    <td>${seasonStats.getSeasonBattingAverage()}</td>
                    <td>${seasonStats.getSeasonOnBasePercentage()}</td>
                    <td>${seasonStats.getSeasonSluggingPercentage()}</td>
                    <td>${seasonStats.getSeasonFieldingPercentage()}</td>
                    <td>${totals.ab}</td>
                    <td>${totals.h}</td>
                    <td>${totals.r}</td>
                    <td>${totals.rbi}</td>
                    <td>${totals.doubles}</td>
                    <td>${totals.triples}</td>
                    <td>${totals.hr}</td>
                    <td>${totals.bb}</td>
                    <td>${totals.so}</td>
                    <td>${totals.sb}</td>
                    <td>${totals.cs}</td>
                    <td>${totals.a}</td>
                    <td>${totals.po}</td>
                    <td>${totals.e}</td>
                    <td>${totals.dp}</td>
                </tr>
            `;
        });
        
        // Add totals row
        html += `
                <tr class="table-warning">
                    <td><strong>CAREER TOTALS</strong></td>
                    <td>-</td>
                    <td><strong>${careerTotals.games}</strong></td>
                    <td><strong>${calculateCareerBattingAverage(careerTotals)}</strong></td>
                    <td><strong>${calculateCareerOnBasePercentage(careerTotals)}</strong></td>
                    <td><strong>${calculateCareerSluggingPercentage(careerTotals)}</strong></td>
                    <td><strong>${calculateCareerFieldingPercentage(careerTotals)}</strong></td>
                    <td><strong>${careerTotals.ab}</strong></td>
                    <td><strong>${careerTotals.h}</strong></td>
                    <td><strong>${careerTotals.r}</strong></td>
                    <td><strong>${careerTotals.rbi}</strong></td>
                    <td><strong>${careerTotals.doubles}</strong></td>
                    <td><strong>${careerTotals.triples}</strong></td>
                    <td><strong>${careerTotals.hr}</strong></td>
                    <td><strong>${careerTotals.bb}</strong></td>
                    <td><strong>${careerTotals.so}</strong></td>
                    <td><strong>${careerTotals.sb}</strong></td>
                    <td><strong>${careerTotals.cs}</strong></td>
                    <td><strong>${careerTotals.a}</strong></td>
                    <td><strong>${careerTotals.po}</strong></td>
                    <td><strong>${careerTotals.e}</strong></td>
                    <td><strong>${careerTotals.dp}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</div>
        `;
    }
    
    statsContainer.innerHTML = html;
}

// Function to show game details in modal
function showGameDetails(year) {
    const seasonData = window.seasonData[year];
    if (!seasonData) {
        console.error(`No data found for year: ${year}`);
        return;
    }
    
    const totals = seasonData.getSeasonTotals();
    
    // Update modal title
    document.getElementById('gameDetailsModalLabel').textContent = `${seasonData.season} - Game Results`;
    
    // Update season info
    document.getElementById('modal-season-info').innerHTML = `
        <div class="alert alert-info">
            <h4>${seasonData.season}</h4>
            <p><strong>Team:</strong> ${seasonData.team}</p>
            <p><strong>Record:</strong> ${totals.wins}-${totals.losses} (${seasonData.getGamesPlayed()} games)</p>
        </div>
    `;
    
    // Update summary stats
    document.getElementById('modal-summary-stats').innerHTML = `
        <div class="row">
            <div class="col-md-2">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Batting Average</h6>
                        <h5 class="text-primary">${seasonData.getSeasonBattingAverage()}</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">On-Base %</h6>
                        <h5 class="text-primary">${seasonData.getSeasonOnBasePercentage()}</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Slugging %</h6>
                        <h5 class="text-primary">${seasonData.getSeasonSluggingPercentage()}</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Fielding %</h6>
                        <h5 class="text-primary">${seasonData.getSeasonFieldingPercentage()}</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">K/PA</h6>
                        <h5 class="text-primary">${seasonData.getStrikeoutsPerPlateAppearance()}</h5>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Steal %</h6>
                        <h5 class="text-primary">${seasonData.getStealingPercentage()}%</h5>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update game results table
    const gameResultsHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Location</th>
                        <th>Result</th>
                        <th>AB</th>
                        <th>H</th>
                        <th>R</th>
                        <th>RBI</th>
                        <th>2B</th>
                        <th>3B</th>
                        <th>HR</th>
                        <th>BB</th>
                        <th>SO</th>
                        <th>SB</th>
                        <th>A</th>
                        <th>PO</th>
                        <th>E</th>
                        <th>DP</th>
                        <th>INN</th>
                        <th>PB</th>
                        <th>SBA</th>
                        <th>RCS</th>
                        <th>PIK</th>
                        <th>AVG</th>
                        <th>FLD%</th>
                        <th>CS%</th>
                    </tr>
                </thead>
                <tbody>
                    ${seasonData.games.map(game => `
                        <tr>
                            <td>${game.date}</td>
                            <td>${game.opponent}</td>
                            <td>${game.location}</td>
                            <td><span class="badge ${game.isWin() ? 'bg-success' : 'bg-danger'}">${game.gameResult}</span></td>
                            <td>${game.ab}</td>
                            <td>${game.h}</td>
                            <td>${game.r}</td>
                            <td>${game.rbi}</td>
                            <td>${game.doubles}</td>
                            <td>${game.triples}</td>
                            <td>${game.hr}</td>
                            <td>${game.bb}</td>
                            <td>${game.so}</td>
                            <td>${game.sb}</td>
                            <td>${game.a}</td>
                            <td>${game.po}</td>
                            <td>${game.e}</td>
                            <td>${game.dp}</td>
                            <td>${game.inn}</td>
                            <td>${game.pb}</td>
                            <td>${game.sba}</td>
                            <td>${game.rcs}</td>
                            <td>${game.pik}</td>
                            <td>${game.getBattingAverage()}</td>
                            <td>${game.getFieldingPercentage()}</td>
                            <td>${game.getRunnersCaughtStealingPercentage()}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('modal-game-results').innerHTML = gameResultsHTML;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('gameDetailsModal'));
    modal.show();
}

// Initialize data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadAllSeasonData().then(allSeasonData => {
        // Data is now available as strongly typed objects
        window.seasonData = allSeasonData;
        
        // Populate statistics section if we're on index.html
        populateIndexStatistics(allSeasonData);
        
        // Example usage:
        if (allSeasonData['2025']) {
            const season2025 = allSeasonData['2025'];
            console.log(`${season2025.season} Stats:`);
            console.log(`Team: ${season2025.team}`);
            console.log(`Games Played: ${season2025.getGamesPlayed()}`);
            console.log(`Season Batting Average: ${season2025.getSeasonBattingAverage()}`);
            console.log(`Season On-Base Percentage: ${season2025.getSeasonOnBasePercentage()}`);
            console.log(`Season Slugging Percentage: ${season2025.getSeasonSluggingPercentage()}`);
            console.log(`Strikeouts per PA: ${season2025.getStrikeoutsPerPlateAppearance()}`);
            console.log(`Walks per PA: ${season2025.getWalksPerPlateAppearance()}`);
            console.log(`Stealing Percentage: ${season2025.getStealingPercentage()}%`);
            
            const totals = season2025.getSeasonTotals();
            console.log(`Season Totals:`, totals);
        }
    });
});
