import { msToHours, sOnEnd } from './timeBits.js';

// 1. The Global State
let appState = {
    allData: [],
    currentView: 'songs', 
    timeFilter: 'all' 
};

// 2. The Initializer
export function calculateStats(songs) {
    console.log("Initializing Dashboard...");
    appState.allData = songs;

    document.getElementById('bento-grid').classList.remove('hidden');
    document.getElementById('controls').classList.remove('hidden');

    setupYearOptions(songs);
    setupEventListeners();
    render();
}

// 3. The Render Logic
function render() {
    const viewport = document.getElementById('content-viewport');
    
    // Filter data
    const filteredData = filterDataByTime(appState.allData, appState.timeFilter);
    
    // Update Header Stats
    updateBentoStats(filteredData);

    // Generate List
    let listHTML = "";
    let sortedData = [];

    if (appState.currentView === 'songs') {
        sortedData = topSongs(filteredData);
        listHTML = generateListHTML(sortedData);
    } else if (appState.currentView === 'artists') {
        sortedData = topArtists(filteredData);
        listHTML = generateListHTML(sortedData);
    } else if (appState.currentView === 'albums') {
        sortedData = topAlbums(filteredData);
        listHTML = generateListHTML(sortedData);
    }

    viewport.innerHTML = listHTML;
}

// 4. Helper to Filter Data
function filterDataByTime(data, year) {
    if (year === 'all') return data;
    return data.filter(item => item.ts && item.ts.startsWith(year));
}

// 5. Helper to Update Header
function updateBentoStats(data) {
    const totalMs = totalTime(data);
    document.getElementById('total-time-display').innerText = msToHours(totalMs);

    // We only need the names for the header, so we look at the first key of the sorted array
    const songs = topSongs(data);
    const artists = topArtists(data);

    // sortedData is now [Name, {count, time}]
    document.getElementById('top-song-display').innerText = songs.length > 0 ? songs[0][0] : "-";
    document.getElementById('top-artist-display').innerText = artists.length > 0 ? artists[0][0] : "-";
}

// 6. Setup Event Listeners
function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            appState.currentView = e.target.dataset.tab;
            render();
        });
    });

    document.getElementById('time-range').addEventListener('change', (e) => {
        appState.timeFilter = e.target.value;
        render();
    });
}

function setupYearOptions(data) {
    const years = new Set();
    data.forEach(item => {
        if (item.ts) years.add(item.ts.slice(0, 4));
    });
    
    const select = document.getElementById('time-range');
    select.innerHTML = '<option value="all">All Time</option>';
    
    Array.from(years).sort().reverse().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        select.appendChild(option);
    });
}

// 7. The New HTML Generator (With Time formatting)
function generateListHTML(sortedData) {
    if (!sortedData.length) return `<p>No data found for this period.</p>`;
    
    let html = `<ol class="stats-list">`;
    
    for (let i = 0; i < 50 && i < sortedData.length; i++) {
        const name = sortedData[i][0];
        const count = sortedData[i][1].count;
        const timeMs = sortedData[i][1].time;

        // Custom formatting: "30 hours, 12 minutes"
        const timeString = formatHoursAndMinutes(timeMs);

        html += `<li>
                    <strong>${name}</strong><br>
                    <span style="color: #b3b3b3; font-size: 0.9em;">
                        ${count.toLocaleString()} plays &bull; <em>${timeString}</em>
                    </span>
                 </li>`;
    }
    html += `</ol>`;
    return html;
}

// 8. Custom Time Formatter for the List
function formatHoursAndMinutes(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours} hour${sOnEnd(hours)}, ${remainingMinutes} minute${sOnEnd(remainingMinutes)}`;
}

// --- DATA PROCESSING HELPERS (Updated to track Time AND Count) ---

function totalTime(songs) {
    return songs.reduce((acc, song) => acc + (song.ms_played || 0), 0);
}

function topSongs(songs) {
    const stats = {};
    for (const song of songs) {
        const name = song.master_metadata_track_name;
        if (name) {
            if (!stats[name]) stats[name] = { count: 0, time: 0 };
            stats[name].count++;
            stats[name].time += song.ms_played || 0;
        }
    }
    // Sort by Count
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
}

function topArtists(songs) {
    const stats = {};
    for (const song of songs) {
        const name = song.master_metadata_album_artist_name;
        if (name) {
            if (!stats[name]) stats[name] = { count: 0, time: 0 };
            stats[name].count++;
            stats[name].time += song.ms_played || 0;
        }
    }
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
}

function topAlbums(songs) {
    const stats = {};
    for (const song of songs) {
        const name = song.master_metadata_album_album_name;
        if (name) {
            if (!stats[name]) stats[name] = { count: 0, time: 0 };
            stats[name].count++;
            stats[name].time += song.ms_played || 0;
        }
    }
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
}
