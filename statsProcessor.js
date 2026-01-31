import { timeFormatter, msToDays, msToHours, sOnEnd } from './timeBits.js';

// 1. The Global State
let appState = {
    allData: [],      // Stores the full raw dataset
    currentView: 'songs', // Default tab
    timeFilter: 'all' // Default year
};

// 2. The Initializer (This replaces your old calculateStats)
export function calculateStats(songs) {
    console.log("Initializing Dashboard...");
    
    // Save the data to our state
    appState.allData = songs;

    // Show the controls (remove the 'hidden' class we added in HTML)
    document.getElementById('bento-grid').classList.remove('hidden');
    document.getElementById('controls').classList.remove('hidden');

    // Generate the year dropdown dynamically
    setupYearOptions(songs);

    // Setup the click listeners for Tabs and Dropdowns
    setupEventListeners();

    // Render the initial view
    render();
}

// 3. The Render Logic (The Brain)
function render() {
    console.log("Rendering view:", appState.currentView, "Filter:", appState.timeFilter);
    const viewport = document.getElementById('content-viewport');
    
    // A. Filter the data first
    const filteredData = filterDataByTime(appState.allData, appState.timeFilter);
    
    // B. Update the Bento Box Stats (Total Time)
    updateBentoStats(filteredData);

    // C. Decide what list to show based on the current Tab
    let listHTML = "";
    
    if (appState.currentView === 'songs') {
        const sorted = topSongs(filteredData);
        listHTML = generateListHTML(sorted, "Song");
    } else if (appState.currentView === 'artists') {
        const sorted = topArtists(filteredData);
        listHTML = generateListHTML(sorted, "Artist");
    } else if (appState.currentView === 'albums') {
        const sorted = topAlbums(filteredData);
        listHTML = generateListHTML(sorted, "Album");
    }

    viewport.innerHTML = listHTML;
}

// 4. Helper to Filter Data
function filterDataByTime(data, year) {
    if (year === 'all') return data;
    // Filter only items where the timestamp string starts with the year
    return data.filter(item => item.ts && item.ts.startsWith(year));
}

// 5. Helper to Update the Top Grid
function updateBentoStats(data) {
    const totalMs = totalTime(data);
    // You might want to format this better later, but using your existing helper:
    document.getElementById('total-time-display').innerText = msToHours(totalMs);

    // Quick calc for top artist/song for the header
    const songs = topSongs(data);
    const artists = topArtists(data);

    document.getElementById('top-song-display').innerText = songs.length > 0 ? songs[0][0] : "-";
    document.getElementById('top-artist-display').innerText = artists.length > 0 ? artists[0][0] : "-";
}

// 6. Setup Event Listeners
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI classes
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update State and Re-render
            appState.currentView = e.target.dataset.tab;
            render();
        });
    });

    // Year Dropdown
    document.getElementById('time-range').addEventListener('change', (e) => {
        appState.timeFilter = e.target.value;
        render();
    });
}

// 7. Dynamic Year Options
function setupYearOptions(data) {
    const years = new Set();
    data.forEach(item => {
        if (item.ts) years.add(item.ts.slice(0, 4));
    });
    
    const select = document.getElementById('time-range');
    // Keep the "All Time" option, clear the rest
    select.innerHTML = '<option value="all">All Time</option>';
    
    // Sort years descending (newest first)
    Array.from(years).sort().reverse().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        select.appendChild(option);
    });
}

// 8. Reusable HTML Generator for Lists
function generateListHTML(sortedData, type) {
    if (!sortedData.length) return `<p>No data found for this period.</p>`;
    
    let html = `<ol class="stats-list">`;
    // Showing top 50 instead of just 10
    for (let i = 0; i < 50 && i < sortedData.length; i++) {
        html += `<li><strong>${sortedData[i][0]}</strong> - ${sortedData[i][1].toLocaleString()} plays</li>`;
    }
    html += `</ol>`;
    return html;
}

// --- YOUR EXISTING MATH HELPERS (Slightly cleaned up) ---

function totalTime(songs) {
    return songs.reduce((acc, song) => acc + (song.ms_played || 0), 0);
}

function topSongs(songs) {
    const counts = {};
    for (const song of songs) {
        const name = song.master_metadata_track_name;
        if (name) counts[name] = (counts[name] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function topArtists(songs) {
    const counts = {};
    for (const song of songs) {
        const name = song.master_metadata_album_artist_name;
        if (name) counts[name] = (counts[name] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function topAlbums(songs) {
    const counts = {};
    for (const song of songs) {
        const name = song.master_metadata_album_album_name;
        if (name) counts[name] = (counts[name] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}
