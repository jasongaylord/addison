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
        this.inn = convertSoftballInnings(data.inn || 0); // Innings caught (converted from softball notation)
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
        const totalAttempts = this.sba; // + this.rcs;
        return totalAttempts > 0 ? ((this.rcs / totalAttempts) * 100).toFixed(1) : '0.0';
    }

    // Check if game was won
    isWin() {
        return this.gameResult.startsWith('W');
    }

    // Check if game was lost
    isLoss() {
        return this.gameResult.startsWith('L');
    }

    // Check if game was tied
    isTie() {
        return this.gameResult.startsWith('T');
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
            totals.losses += game.isLoss() ? 1 : 0;
            totals.ties += game.isTie() ? 1 : 0;
            return totals;
        }, {
            ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0,
            doubles: 0, triples: 0, hr: 0, gs: 0, sb: 0, cs: 0,
            hbp: 0, e: 0, a: 0, po: 0, dp: 0, tp: 0,
            inn: 0, pb: 0, sba: 0, rcs: 0, pik: 0,
            wins: 0, losses: 0, ties: 0
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
        
        // Handle new structure with multiple teams
        if (data.teams && Array.isArray(data.teams)) {
            // Return array of SeasonStats objects for each team
            return data.teams.map(teamData => new SeasonStats(teamData));
        } else {
            // Handle old structure with single team
            return new SeasonStats(data);
        }
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        // Fallback to embedded data if fetch fails
        return loadEmbeddedData(filename);
    }
}

// Fallback function with embedded data
function loadEmbeddedData(filename) {
    const embeddedData = {
        'sophmore.json': {
            teams: [
                {
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
        ]
        }
    };
    
    if (embeddedData[filename]) {
        // Handle new structure
        if (embeddedData[filename].teams) {
            return embeddedData[filename].teams.map(teamData => new SeasonStats(teamData));
        } else {
            return new SeasonStats(embeddedData[filename]);
        }
    }
    return null;
}

// Function to load all JSON files from data folder
async function loadAllSeasonData() {
    const dataFiles = ['freshman.json', 'sophmore.json', 'junior.json', 'senior.json']; // High school years
    const seasonData = {};
    
    for (const filename of dataFiles) {
        const result = await loadJsonData(filename);
        if (result) {
            // Handle both single team and multiple teams
            if (Array.isArray(result)) {
                // Multiple teams in one file - use season name as key
                result.forEach((seasonStats) => {
                    const key = seasonStats.season || `${filename.replace('.json', '')}_team_${seasonStats.team}`;
                    seasonData[key] = seasonStats;
                    console.log(`Loaded ${key} season data:`, seasonStats);
                });
            } else {
                // Single team
                const year = filename.replace('.json', '');
                seasonData[year] = result;
                console.log(`Loaded ${year} season data:`, result);
            }
        }
    }
    
    return seasonData;
}

// Function to group seasons by high school year
function groupSeasonsByHighSchoolYear(allSeasonData) {
    const highSchoolYears = {
        'Freshman (2024)': [],
        'Sophomore (2025)': [],
        'Junior (2026)': [],
        'Senior (2027)': []
    };
    
    Object.entries(allSeasonData).forEach(([seasonKey, seasonStats]) => {
        const season = seasonStats.season;
        
        // Freshman year: Fall 2023, Spring 2024, Summer 2024
        if (season === 'Fall 2023' || season === 'Spring 2024' || season === 'Summer 2024') {
            highSchoolYears['Freshman (2024)'].push({key: seasonKey, stats: seasonStats});
        }
        // Sophomore year: Fall 2024, Spring 2025, Summer 2025
        else if (season === 'Fall 2024' || season === 'Spring 2025' || season === 'Summer 2025') {
            highSchoolYears['Sophomore (2025)'].push({key: seasonKey, stats: seasonStats});
        }
        // Junior year: Fall 2025, Spring 2026, Summer 2026
        else if (season === 'Fall 2025' || season === 'Spring 2026' || season === 'Summer 2026') {
            highSchoolYears['Junior (2026)'].push({key: seasonKey, stats: seasonStats});
        }
        // Senior year: Fall 2026, Spring 2027, Summer 2027
        else if (season === 'Fall 2026' || season === 'Spring 2027' || season === 'Summer 2027') {
            highSchoolYears['Senior (2027)'].push({key: seasonKey, stats: seasonStats});
        }
    });
    
    return highSchoolYears;
}

// Function to calculate career totals from all seasons
function calculateCareerTotals(allSeasonData) {
    const careerTotals = {
        ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0,
        doubles: 0, triples: 0, hr: 0, gs: 0, sb: 0, cs: 0,
        hbp: 0, e: 0, a: 0, po: 0, dp: 0, tp: 0,
        inn: 0, pb: 0, sba: 0, rcs: 0, pik: 0,
        wins: 0, losses: 0, ties: 0, games: 0
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
        careerTotals.ties += seasonTotals.ties;
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

function calculateCareerOPSPercentage(careerTotals) {
    return (parseFloat(calculateCareerOnBasePercentage(careerTotals)) + parseFloat(calculateCareerSluggingPercentage(careerTotals))).toFixed(3);
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


// Helper function to render career summary cards
function renderCareerSummary(allSeasonData) {
    const careerTotals = calculateCareerTotals(allSeasonData);
    
    return `
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
                                <h5 class="card-title">OPS Percentage</h5>
                                <h2 class="text-primary">${calculateCareerOPSPercentage(careerTotals)}</h2>
                                <p class="card-text"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
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
                                <h5 class="card-title">Stealing Percentage</h5>
                                <h2 class="text-primary">${calculateCareerStealingPercentage(careerTotals)}%</h2>
                                <p class="card-text">${careerTotals.sb} stolen bases, ${careerTotals.cs} caught stealing</p>
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
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">CS% (Catching)</h5>
                                <h2 class="text-primary">${calculateCareerRunnersCaughtStealingPercentage(careerTotals)}%</h2>
                                <p class="card-text">${careerTotals.rcs} caught, ${careerTotals.sba} allowed, ${formatSoftballInnings(careerTotals.inn)} innings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// Helper function to render batting career summary cards
function renderBattingCareerSummary(allSeasonData) {
    const careerTotals = calculateCareerTotals(allSeasonData);
    
    return `
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
                                <h5 class="card-title">Stealing Percentage</h5>
                                <h2 class="text-primary">${calculateCareerStealingPercentage(careerTotals)}%</h2>
                                <p class="card-text">${careerTotals.sb} stolen bases, ${careerTotals.cs} caught stealing</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
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
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Record</h5>
                                <h2 class="text-primary">${careerTotals.wins}-${careerTotals.losses}-${careerTotals.ties}</h2>
                                <p class="card-text">${careerTotals.games} games played</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Grand Slams</h5>
                                <h2 class="text-primary">${careerTotals.gs}</h2>
                                <p class="card-text">Career grand slams</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    `;
}

// Helper function to render fielding/catching career summary cards
function renderFieldingCareerSummary(allSeasonData) {
    const careerTotals = calculateCareerTotals(allSeasonData);
    
    return `
        <div class="row mb-4">
            <div class="col-12">
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Fielding Percentage</h5>
                                <h2 class="text-primary">${calculateCareerFieldingPercentage(careerTotals)}</h2>
                                <p class="card-text">${careerTotals.a + careerTotals.po} chances, ${careerTotals.e} errors</p>
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
                                <h5 class="card-title">Total Assists</h5>
                                <h2 class="text-primary">${careerTotals.a}</h2>
                                <p class="card-text">Career assists</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Total Putouts</h5>
                                <h2 class="text-primary">${careerTotals.po}</h2>
                                <p class="card-text">Career putouts</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Double Plays</h5>
                                <h2 class="text-primary">${careerTotals.dp}</h2>
                                <p class="card-text">Career double plays</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Triple Plays</h5>
                                <h2 class="text-primary">${careerTotals.tp}</h2>
                                <p class="card-text">Career triple plays</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Innings Caught</h5>
                                <h2 class="text-primary">${formatSoftballInnings(careerTotals.inn)}</h2>
                                <p class="card-text">Career innings caught</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <h5 class="card-title">Passed Balls</h5>
                                <h2 class="text-primary">${careerTotals.pb}</h2>
                                <p class="card-text">Career passed balls</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper function to render batting season table
function renderBattingSeasonTable(allSeasonData) {
    const careerTotals = calculateCareerTotals(allSeasonData);
    const highSchoolYears = groupSeasonsByHighSchoolYear(allSeasonData);
    
    let html = '';
    
    // Add career totals table first
    html += `
        <div class="row mb-4">
            <div class="col-12">
                <h4 class="mb-3">Career Totals</h4>
                <div class="table-responsive">
                    <table class="table table-striped table-hover table-career-totals">
                        <thead>
                            <tr>
                                <th>Career</th>
                                <th>GP</th>
                                <th>AVG</th>
                                <th>OBP</th>
                                <th>SLG</th>
                                <th>AB</th>
                                <th>H</th>
                                <th>R</th>
                                <th>RBI</th>
                                <th>2B</th>
                                <th>3B</th>
                                <th>HR</th>
                                <th>GS</th>
                                <th>BB</th>
                                <th>SO</th>
                                <th>HBP</th>
                                <th>SB</th>
                                <th>CS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>TOTALS</strong></td>
                                <td><strong>${careerTotals.games}</strong></td>
                                <td><strong>${calculateCareerBattingAverage(careerTotals)}</strong></td>
                                <td><strong>${calculateCareerOnBasePercentage(careerTotals)}</strong></td>
                                <td><strong>${calculateCareerSluggingPercentage(careerTotals)}</strong></td>
                                <td><strong>${careerTotals.ab}</strong></td>
                                <td><strong>${careerTotals.h}</strong></td>
                                <td><strong>${careerTotals.r}</strong></td>
                                <td><strong>${careerTotals.rbi}</strong></td>
                                <td><strong>${careerTotals.doubles}</strong></td>
                                <td><strong>${careerTotals.triples}</strong></td>
                                <td><strong>${careerTotals.hr}</strong></td>
                                <td><strong>${careerTotals.gs}</strong></td>
                                <td><strong>${careerTotals.bb}</strong></td>
                                <td><strong>${careerTotals.so}</strong></td>
                                <td><strong>${careerTotals.hbp}</strong></td>
                                <td><strong>${careerTotals.sb}</strong></td>
                                <td><strong>${careerTotals.cs}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Define the order of high school years (sophomore first, then freshman)
    const yearOrder = ['Sophomore (2025)', 'Freshman (2024)', 'Junior (2026)', 'Senior (2027)'];
    
    // Create separate table for each high school year in the specified order
    yearOrder.forEach(yearLabel => {
        const seasons = highSchoolYears[yearLabel];
        if (seasons && seasons.length > 0) {
            // Calculate year totals
            const yearTotals = {
                ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0,
                doubles: 0, triples: 0, hr: 0, gs: 0, sb: 0, cs: 0,
                hbp: 0, games: 0
            };
            
            html += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h4 class="mb-3">${yearLabel}</h4>
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
                                        <th>AB</th>
                                        <th>H</th>
                                        <th>R</th>
                                        <th>RBI</th>
                                        <th>2B</th>
                                        <th>3B</th>
                                        <th>HR</th>
                                        <th>GS</th>
                                        <th>BB</th>
                                        <th>SO</th>
                                        <th>HBP</th>
                                        <th>SB</th>
                                        <th>CS</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;
            
            // Add individual season rows
            seasons.forEach(({key, stats}) => {
                const totals = stats.getSeasonTotals();
                yearTotals.ab += totals.ab;
                yearTotals.r += totals.r;
                yearTotals.h += totals.h;
                yearTotals.rbi += totals.rbi;
                yearTotals.bb += totals.bb;
                yearTotals.so += totals.so;
                yearTotals.doubles += totals.doubles;
                yearTotals.triples += totals.triples;
                yearTotals.hr += totals.hr;
                yearTotals.gs += totals.gs;
                yearTotals.sb += totals.sb;
                yearTotals.cs += totals.cs;
                yearTotals.hbp += totals.hbp;
                yearTotals.games += stats.getGamesPlayed();
                
                html += `
                    <tr>
                        <td><a onclick="showGameDetails('${key}')">${stats.season}</a></td>
                        <td>${stats.team}</td>
                        <td>${stats.getGamesPlayed()}</td>
                        <td>${stats.getSeasonBattingAverage()}</td>
                        <td>${stats.getSeasonOnBasePercentage()}</td>
                        <td>${stats.getSeasonSluggingPercentage()}</td>
                        <td>${totals.ab}</td>
                        <td>${totals.h}</td>
                        <td>${totals.r}</td>
                        <td>${totals.rbi}</td>
                        <td>${totals.doubles}</td>
                        <td>${totals.triples}</td>
                        <td>${totals.hr}</td>
                        <td>${totals.gs}</td>
                        <td>${totals.bb}</td>
                        <td>${totals.so}</td>
                        <td>${totals.hbp}</td>
                        <td>${totals.sb}</td>
                        <td>${totals.cs}</td>
                    </tr>
                `;
            });
            
            // Add year total row if there are multiple seasons
            if (seasons.length > 1) {
                const yearAvg = yearTotals.ab > 0 ? (yearTotals.h / yearTotals.ab).toFixed(3) : '0.000';
                const yearOBP = (yearTotals.ab + yearTotals.bb + yearTotals.hbp) > 0 ? 
                    ((yearTotals.h + yearTotals.bb + yearTotals.hbp) / (yearTotals.ab + yearTotals.bb + yearTotals.hbp)).toFixed(3) : '0.000';
                const yearSLG = yearTotals.ab > 0 ? 
                    ((yearTotals.h + yearTotals.doubles + (yearTotals.triples * 2) + (yearTotals.hr * 3)) / yearTotals.ab).toFixed(3) : '0.000';
                
                html += `
                    <tr class="table-summary">
                        <td><strong>YEAR TOTAL</strong></td>
                        <td>-</td>
                        <td><strong>${yearTotals.games}</strong></td>
                        <td><strong>${yearAvg}</strong></td>
                        <td><strong>${yearOBP}</strong></td>
                        <td><strong>${yearSLG}</strong></td>
                        <td><strong>${yearTotals.ab}</strong></td>
                        <td><strong>${yearTotals.h}</strong></td>
                        <td><strong>${yearTotals.r}</strong></td>
                        <td><strong>${yearTotals.rbi}</strong></td>
                        <td><strong>${yearTotals.doubles}</strong></td>
                        <td><strong>${yearTotals.triples}</strong></td>
                        <td><strong>${yearTotals.hr}</strong></td>
                        <td><strong>${yearTotals.gs}</strong></td>
                        <td><strong>${yearTotals.bb}</strong></td>
                        <td><strong>${yearTotals.so}</strong></td>
                        <td><strong>${yearTotals.hbp}</strong></td>
                        <td><strong>${yearTotals.sb}</strong></td>
                        <td><strong>${yearTotals.cs}</strong></td>
                    </tr>
                `;
            }
            
            html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    return html;
}

// Helper function to render fielding/catching season table
function renderFieldingSeasonTable(allSeasonData) {
    const careerTotals = calculateCareerTotals(allSeasonData);
    const highSchoolYears = groupSeasonsByHighSchoolYear(allSeasonData);
    
    let html = '';
    
    // Add career totals table first
    html += `
        <div class="row mb-4">
            <div class="col-12">
                <h4 class="mb-3">Career Totals</h4>
                <div class="table-responsive">
                    <table class="table table-striped table-hover table-career-totals">
                        <thead>
                            <tr>
                                <th>Career</th>
                                <th>GP</th>
                                <th>FLD%</th>
                                <th>CS%</th>
                                <th>A</th>
                                <th>PO</th>
                                <th>E</th>
                                <th>DP</th>
                                <th>TP</th>
                                <th>INN</th>
                                <th>PB</th>
                                <th>SBA</th>
                                <th>RCS</th>
                                <th>PIK</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>TOTALS</strong></td>
                                <td><strong>${careerTotals.games}</strong></td>
                                <td><strong>${calculateCareerFieldingPercentage(careerTotals)}</strong></td>
                                <td><strong>${calculateCareerRunnersCaughtStealingPercentage(careerTotals)}%</strong></td>
                                <td><strong>${careerTotals.a}</strong></td>
                                <td><strong>${careerTotals.po}</strong></td>
                                <td><strong>${careerTotals.e}</strong></td>
                                <td><strong>${careerTotals.dp}</strong></td>
                                <td><strong>${careerTotals.tp}</strong></td>
                                <td><strong>${formatSoftballInnings(careerTotals.inn)}</strong></td>
                                <td><strong>${careerTotals.pb}</strong></td>
                                <td><strong>${careerTotals.sba}</strong></td>
                                <td><strong>${careerTotals.rcs}</strong></td>
                                <td><strong>${careerTotals.pik}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Create separate table for each high school year in order: Sophomore, then Freshman
    const yearOrder = ['Sophomore (2025)', 'Freshman (2024)', 'Junior (2026)', 'Senior (2027)'];
    
    yearOrder.forEach(yearLabel => {
        const seasons = highSchoolYears[yearLabel];
        if (seasons && seasons.length > 0) {
            // Calculate year totals
            const yearTotals = {
                a: 0, po: 0, e: 0, dp: 0, tp: 0, inn: 0, pb: 0,
                sba: 0, rcs: 0, pik: 0, games: 0
            };
            
            html += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h4 class="mb-3">${yearLabel}</h4>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Season</th>
                                        <th>Team</th>
                                        <th>GP</th>
                                        <th>FLD%</th>
                                        <th>CS%</th>
                                        <th>A</th>
                                        <th>PO</th>
                                        <th>E</th>
                                        <th>DP</th>
                                        <th>TP</th>
                                        <th>INN</th>
                                        <th>PB</th>
                                        <th>SBA</th>
                                        <th>RCS</th>
                                        <th>PIK</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;
            
            // Add individual season rows
            seasons.forEach(({key, stats}) => {
                const totals = stats.getSeasonTotals();
                yearTotals.a += totals.a;
                yearTotals.po += totals.po;
                yearTotals.e += totals.e;
                yearTotals.dp += totals.dp;
                yearTotals.tp += totals.tp;
                yearTotals.inn += totals.inn;
                yearTotals.pb += totals.pb;
                yearTotals.sba += totals.sba;
                yearTotals.rcs += totals.rcs;
                yearTotals.pik += totals.pik;
                yearTotals.games += stats.getGamesPlayed();
                
                html += `
                    <tr>
                        <td><a onclick="showGameDetails('${key}')">${stats.season}</a></td>
                        <td>${stats.team}</td>
                        <td>${stats.getGamesPlayed()}</td>
                        <td>${stats.getSeasonFieldingPercentage()}</td>
                        <td>${stats.getSeasonRunnersCaughtStealingPercentage()}%</td>
                        <td>${totals.a}</td>
                        <td>${totals.po}</td>
                        <td>${totals.e}</td>
                        <td>${totals.dp}</td>
                        <td>${totals.tp}</td>
                        <td>${formatSoftballInnings(totals.inn)}</td>
                        <td>${totals.pb}</td>
                        <td>${totals.sba}</td>
                        <td>${totals.rcs}</td>
                        <td>${totals.pik}</td>
                    </tr>
                `;
            });
            
            // Add year total row if there are multiple seasons
            if (seasons.length > 1) {
                const yearFLD = (yearTotals.a + yearTotals.po + yearTotals.e) > 0 ? 
                    ((yearTotals.a + yearTotals.po) / (yearTotals.a + yearTotals.po + yearTotals.e)).toFixed(3) : '1.000';
                const yearCS = (yearTotals.sba + yearTotals.rcs) > 0 ? 
                    ((yearTotals.rcs / (yearTotals.sba + yearTotals.rcs)) * 100).toFixed(1) : '0.0';
                
                html += `
                    <tr class="table-summary">
                        <td><strong>YEAR TOTAL</strong></td>
                        <td>-</td>
                        <td><strong>${yearTotals.games}</strong></td>
                        <td><strong>${yearFLD}</strong></td>
                        <td><strong>${yearCS}%</strong></td>
                        <td><strong>${yearTotals.a}</strong></td>
                        <td><strong>${yearTotals.po}</strong></td>
                        <td><strong>${yearTotals.e}</strong></td>
                        <td><strong>${yearTotals.dp}</strong></td>
                        <td><strong>${yearTotals.tp}</strong></td>
                        <td><strong>${formatSoftballInnings(yearTotals.inn)}</strong></td>
                        <td><strong>${yearTotals.pb}</strong></td>
                        <td><strong>${yearTotals.sba}</strong></td>
                        <td><strong>${yearTotals.rcs}</strong></td>
                        <td><strong>${yearTotals.pik}</strong></td>
                    </tr>
                `;
            }
            
            html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    return html;
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
        // Add month/year filter dropdown
        html += `
            <div class="row mb-3">
                <div class="col-12">
                    <div class="d-flex justify-content-center">
                        <div class="me-3">
                            <label for="month-year-filter" class="form-label">Filter by Month/Year:</label>
                            <select class="form-select" id="month-year-filter">
                                <option value="all">All Games</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add summary cards
        html += `
            <div id="summary-cards">
                ${renderCareerSummary(allSeasonData)}
            </div>
        `;

        // Add radio button toggle for main stats
        html += `
            <div class="row mb-3">
                <div class="col-12">
                    <div class="d-flex justify-content-center">
                        <div class="btn-group" role="group" aria-label="Statistics Toggle">
                            <input type="radio" class="btn-check" name="main-stats-toggle" id="main-batting-toggle" value="batting" checked>
                            <label class="btn btn-outline-primary" for="main-batting-toggle">Batting Statistics</label>
                            
                            <input type="radio" class="btn-check" name="main-stats-toggle" id="main-fielding-toggle" value="fielding">
                            <label class="btn btn-outline-primary" for="main-fielding-toggle">Fielding/Catching Statistics</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add containers for batting and fielding views
        html += `
            <div id="main-batting-view">
                ${renderBattingSeasonTable(allSeasonData)}
            </div>
            <div id="main-fielding-view" style="display: none;">
                ${renderFieldingSeasonTable(allSeasonData)}
            </div>
        `;
    }
    
    statsContainer.innerHTML = html;
    
    // Populate month/year filter options
    populateMonthYearFilter(allSeasonData);
    
    // Add event listeners for main stats toggle
    document.querySelectorAll('input[name="main-stats-toggle"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const battingView = document.getElementById('main-batting-view');
            const fieldingView = document.getElementById('main-fielding-view');
            
            if (this.value === 'batting') {
                battingView.style.display = 'block';
                fieldingView.style.display = 'none';
            } else {
                battingView.style.display = 'none';
                fieldingView.style.display = 'block';
            }
        });
    });

    // Add event listener for month/year filter
    const monthYearFilter = document.getElementById('month-year-filter');
    if (monthYearFilter) {
        monthYearFilter.addEventListener('change', function() {
            applyMonthYearFilter(allSeasonData, this.value);
        });
    }
}

// Function to extract month/year from various date formats
function extractMonthYear(dateString) {
    if (!dateString) return null;
    
    // Handle various date formats
    let date;
    try {
        // Try parsing different formats
        if (dateString.includes('/')) {
            // Handle formats like "07/24/2025 1:00pm", "3/19/25 4:15pm", etc.
            const datePart = dateString.split(' ')[0]; // Get date part without time
            const parts = datePart.split('/');
            let month = parseInt(parts[0]);
            let year = parseInt(parts[2]);
            
            // Handle 2-digit years
            if (year < 100) {
                year += year < 50 ? 2000 : 1900;
            }
            
            return {
                month: month,
                year: year,
                monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
                display: `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`
            };
        }
    } catch (error) {
        console.warn('Could not parse date:', dateString, error);
    }
    
    return null;
}

// Function to populate month/year filter options
function populateMonthYearFilter(allSeasonData) {
    const filter = document.getElementById('month-year-filter');
    if (!filter) return;
    
    const monthYears = new Set();
    
    // Collect all unique month/year combinations from all games
    Object.values(allSeasonData).forEach(seasonStats => {
        seasonStats.games.forEach(game => {
            const monthYear = extractMonthYear(game.date);
            if (monthYear) {
                monthYears.add(`${monthYear.year}-${monthYear.month.toString().padStart(2, '0')}`);
            }
        });
    });
    
    // Sort month/years chronologically (newest first)
    const sortedMonthYears = Array.from(monthYears).sort().reverse();
    
    // Populate filter options
    sortedMonthYears.forEach(monthYearKey => {
        const [year, month] = monthYearKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
        const option = document.createElement('option');
        option.value = monthYearKey;
        option.textContent = `${monthName} ${year}`;
        filter.appendChild(option);
    });
}

// Function to apply month/year filter
function applyMonthYearFilter(allSeasonData, filterValue) {
    let filteredData = {};
    
    if (filterValue === 'all') {
        // Show all data
        filteredData = allSeasonData;
    } else {
        // Filter data by selected month/year
        const [filterYear, filterMonth] = filterValue.split('-');
        
        Object.entries(allSeasonData).forEach(([key, seasonStats]) => {
            const filteredGames = seasonStats.games.filter(game => {
                const monthYear = extractMonthYear(game.date);
                if (!monthYear) return false;
                
                return monthYear.year.toString() === filterYear && 
                       monthYear.month.toString().padStart(2, '0') === filterMonth;
            });
            
            if (filteredGames.length > 0) {
                // Create new SeasonStats object with filtered games
                const filteredSeasonData = {
                    team: seasonStats.team,
                    season: seasonStats.season,
                    games: filteredGames
                };
                filteredData[key] = new SeasonStats(filteredSeasonData);
            }
        });
    }
    
    // Update the summary cards
    const summaryCards = document.getElementById('summary-cards');
    if (summaryCards) {
        summaryCards.innerHTML = renderCareerSummary(filteredData);
    }
    
    // Update the tables
    const battingView = document.getElementById('main-batting-view');
    const fieldingView = document.getElementById('main-fielding-view');
    
    if (battingView) {
        battingView.innerHTML = renderBattingSeasonTable(filteredData);
    }
    
    if (fieldingView) {
        fieldingView.innerHTML = renderFieldingSeasonTable(filteredData);
    }
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
            <p><strong>Record:</strong> ${totals.wins}-${totals.losses}-${totals.ties} (${seasonData.getGamesPlayed()} games)</p>
        </div>
    `;
    
    // Add modal toggle for batting vs fielding/catching
    const modalToggleHTML = `
        <div class="row mb-3">
            <div class="col-12">
                <div class="d-flex justify-content-center">
                    <div class="btn-group" role="group" aria-label="Modal Statistics Toggle">
                        <input type="radio" class="btn-check" name="modal-stats-toggle" id="modal-batting-toggle" value="batting" checked>
                        <label class="btn btn-outline-primary" for="modal-batting-toggle">Batting Statistics</label>
                        
                        <input type="radio" class="btn-check" name="modal-stats-toggle" id="modal-fielding-toggle" value="fielding">
                        <label class="btn btn-outline-primary" for="modal-fielding-toggle">Fielding/Catching Statistics</label>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update summary stats with toggle and both views
    document.getElementById('modal-summary-stats').innerHTML = `
        ${modalToggleHTML}
        <div id="modal-batting-stats" class="modal-stats-view">
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
                            <h6 class="card-title">K/PA</h6>
                            <h5 class="text-primary">${seasonData.getStrikeoutsPerPlateAppearance()}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title">BB/PA</h6>
                            <h5 class="text-primary">${seasonData.getWalksPerPlateAppearance()}</h5>
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
        </div>
        <div id="modal-fielding-stats" class="modal-stats-view" style="display: none;">
            <div class="row">
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
                            <h6 class="card-title">CS %</h6>
                            <h5 class="text-primary">${seasonData.getSeasonRunnersCaughtStealingPercentage()}%</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title">Assists</h6>
                            <h5 class="text-primary">${totals.a}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title">Putouts</h6>
                            <h5 class="text-primary">${totals.po}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title">Errors</h6>
                            <h5 class="text-primary">${totals.e}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title">Double Plays</h6>
                            <h5 class="text-primary">${totals.dp}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create batting game results table
    const battingGameResultsHTML = `
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
                        <th>GS</th>
                        <th>BB</th>
                        <th>SO</th>
                        <th>HBP</th>
                        <th>SB</th>
                        <th>CS</th>
                        <th>AVG</th>
                        <th>OBP</th>
                    </tr>
                </thead>
                <tbody>
                    ${seasonData.games.map(game => `
                        <tr>
                            <td>${game.date}</td>
                            <td>${game.opponent}</td>
                            <td>${game.location}</td>
                            <td><span class="badge ${game.isWin() ? 'bg-success' : game.isLoss() ? 'bg-danger' : 'bg-secondary'}">${game.gameResult}</span></td>
                            <td>${game.ab}</td>
                            <td>${game.h}</td>
                            <td>${game.r}</td>
                            <td>${game.rbi}</td>
                            <td>${game.doubles}</td>
                            <td>${game.triples}</td>
                            <td>${game.hr}</td>
                            <td>${game.gs}</td>
                            <td>${game.bb}</td>
                            <td>${game.so}</td>
                            <td>${game.hbp}</td>
                            <td>${game.sb}</td>
                            <td>${game.cs}</td>
                            <td>${game.getBattingAverage()}</td>
                            <td>${game.getOnBasePercentage()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Create fielding/catching game results table
    const fieldingGameResultsHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Location</th>
                        <th>Result</th>
                        <th>A</th>
                        <th>PO</th>
                        <th>E</th>
                        <th>DP</th>
                        <th>TP</th>
                        <th>INN</th>
                        <th>PB</th>
                        <th>SBA</th>
                        <th>RCS</th>
                        <th>PIK</th>
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
                            <td><span class="badge ${game.isWin() ? 'bg-success' : game.isLoss() ? 'bg-danger' : 'bg-secondary'}">${game.gameResult}</span></td>
                            <td>${game.a}</td>
                            <td>${game.po}</td>
                            <td>${game.e}</td>
                            <td>${game.dp}</td>
                            <td>${game.tp}</td>
                            <td>${formatSoftballInnings(game.inn)}</td>
                            <td>${game.pb}</td>
                            <td>${game.sba}</td>
                            <td>${game.rcs}</td>
                            <td>${game.pik}</td>
                            <td>${game.getFieldingPercentage()}</td>
                            <td>${game.getRunnersCaughtStealingPercentage()}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Update game results with both views
    document.getElementById('modal-game-results').innerHTML = `
        <div id="modal-batting-game-results" class="modal-game-results-view">
            ${battingGameResultsHTML}
        </div>
        <div id="modal-fielding-game-results" class="modal-game-results-view" style="display: none;">
            ${fieldingGameResultsHTML}
        </div>
    `;
    
    // Add event listeners for modal toggle
    document.querySelectorAll('input[name="modal-stats-toggle"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const battingStats = document.getElementById('modal-batting-stats');
            const fieldingStats = document.getElementById('modal-fielding-stats');
            const battingGameResults = document.getElementById('modal-batting-game-results');
            const fieldingGameResults = document.getElementById('modal-fielding-game-results');
            
            if (this.value === 'batting') {
                battingStats.style.display = 'block';
                fieldingStats.style.display = 'none';
                battingGameResults.style.display = 'block';
                fieldingGameResults.style.display = 'none';
            } else {
                battingStats.style.display = 'none';
                fieldingStats.style.display = 'block';
                battingGameResults.style.display = 'none';
                fieldingGameResults.style.display = 'block';
            }
        });
    });
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('gameDetailsModal'));
    modal.show();
}

// Utility functions for softball innings conversion
// In softball, innings are recorded in thirds: .1 = 1/3, .2 = 2/3

/**
 * Convert softball innings notation to actual decimal value
 * @param {number} inningsValue - The innings value from JSON (e.g., 2.1, 5.2, etc.)
 * @returns {number} - The actual decimal value (e.g., 2.33, 5.67, etc.)
 */
function convertSoftballInnings(inningsValue) {
    if (!inningsValue || inningsValue === 0) return 0;
    
    const wholeInnings = Math.floor(inningsValue);
    const fraction = inningsValue - wholeInnings;
    
    // Handle common softball fraction notations
    if (fraction === 0.1) {
        return wholeInnings + (1/3); // .1 = 1/3
    } else if (fraction === 0.2) {
        return wholeInnings + (2/3); // .2 = 2/3
    } else if (Math.abs(fraction - 0.33) < 0.01 || Math.abs(fraction - 0.3) < 0.01) {
        return wholeInnings + (1/3); // .33 or .3 = 1/3
    } else if (Math.abs(fraction - 0.67) < 0.01 || Math.abs(fraction - 0.66) < 0.01) {
        return wholeInnings + (2/3); // .67 or .66 = 2/3
    }
    
    // If it's already a proper decimal, return as-is
    return inningsValue;
}

/**
 * Format innings for display in softball notation
 * @param {number} actualInnings - The actual decimal innings value
 * @returns {string} - The formatted innings for display (e.g., "2.1", "5.2", etc.)
 */
function formatSoftballInnings(actualInnings) {
    if (!actualInnings || actualInnings === 0) return "0";
    
    const wholeInnings = Math.floor(actualInnings);
    const fraction = actualInnings - wholeInnings;
    
    // Convert decimal fractions back to softball notation
    if (Math.abs(fraction - (1/3)) < 0.01) {
        return wholeInnings + ".1";
    } else if (Math.abs(fraction - (2/3)) < 0.01) {
        return wholeInnings + ".2";
    } else if (fraction === 0) {
        return wholeInnings.toString();
    }
    
    // For any other values, round to nearest third
    if (fraction < (1/6)) {
        return wholeInnings.toString();
    } else if (fraction < 0.5) {
        return wholeInnings + ".1";
    } else if (fraction < (5/6)) {
        return wholeInnings + ".2";
    } else {
        return (wholeInnings + 1).toString();
    }
}

// Initialize data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadAllSeasonData().then(allSeasonData => {
        // Data is now available as strongly typed objects
        window.seasonData = allSeasonData;
        
        // Populate statistics section if we're on index.html
        populateIndexStatistics(allSeasonData);
        
        // Example usage:
        if (allSeasonData['Summer 2025']) {
            const season2025 = allSeasonData['Summer 2025'];
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
