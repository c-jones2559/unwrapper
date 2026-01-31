import { timeFormatter, msToDays, msToHours, sOnEnd } from './timeBits.js';

export function calculateStats(songs) {
    console.log("Calculating stats...")
    const stats = document.getElementById("stats");
    stats.innerHTML = "Calculating...<br>If you're seeing this, there's probably an error."


    const time = totalTime(songs);
    let output = `<h2>Overview</h2>
    Your total listening time is: ${timeFormatter(time)}!<br>
    That's ~${msToHours(time)} or ~${msToDays(time)}!<br>`

    output += `<h2>Top songs</h2>`
    const sortedSongs = topSongs(songs);
    for (let i = 0; i < 10 && i < sortedSongs.length; i++) {
        output += `${i+1}. ${sortedSongs[i][0]} with ${sortedSongs[i][1]} listens!<br>`;
    }

    output += `<h2>Top artists</h2>`
    const sortedArtists = topArtists(songs);
    for (let i = 0; i < 10 && i < sortedArtists.length; i++) {
        output += `${i+1}. ${sortedArtists[i][0]} with ${sortedArtists[i][1]} listens!<br>`;
    }

    output += `<h2>Top albums</h2>`
    const sortedAlbums = topAlbums(songs);
    for (let i = 0; i < 10 && i < sortedAlbums.length; i++) {
        output += `${i+1}. ${sortedAlbums[i][0]} with ${sortedAlbums[i][1]} listens!<br>`;
    }

    stats.innerHTML = output;
    console.log("All stats calculated.");
}

function totalTime(songs) {
    console.log("Calculating time...");
    let total = 0;
    for (const song of songs) {
        total += song.ms_played;
    }
    console.log("Time calculated.");
    return total;
}

function topSongs(songs) {
    console.log("Calculating top songs...");
    const topSongs = {};
    const topSongsTime = {};

    for (const song of songs) {
        if (song.master_metadata_track_name == null) {continue;}
        topSongs[song.master_metadata_track_name] = (topSongs[song.master_metadata_track_name] || 0) + 1; 
        topSongsTime[song.master_metadata_track_name] = (topSongsTime[song.master_metadata_track_name] || 0) + song.ms_played; 
    }

    const sortedSongs = Object.entries(topSongs)
        .sort(([, countA], [, countB]) => countB - countA);
    const sortedSongsTime = Object.entries(topSongsTime)
        .sort(([, countA], [, countB]) => countB - countA);

    console.log("Top songs calculated.");
    return sortedSongsTime;
}

function topArtists(songs) {
    console.log("Calculating top artists...");
    const topArtists = {};

    for (const song of songs) {
        topArtists[song.master_metadata_album_artist_name] = (topArtists[song.master_metadata_album_artist_name] || 0) + 1; 
    }

    const sortedArtists = Object.entries(topArtists)
        .sort(([, countA], [, countB]) => countB - countA);

    console.log("Top artists calculated.");
    return sortedArtists;
}

function topAlbums(songs) {
    console.log("Calculating top albums...");
    const topAlbums = {};

    for (const song of songs) {
        topAlbums[song.master_metadata_album_album_name] = (topAlbums[song.master_metadata_album_album_name] || 0) + 1; 
    }

    const sortedAlbums = Object.entries(topAlbums)
        .sort(([, countA], [, countB]) => countB - countA);

    console.log("Top albums calculated.");
    return sortedAlbums;
}
