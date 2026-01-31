import { timeFormatter, msToDays, msToHours, sOnEnd } from './timeBits.js';

export function calculateStats(songs) {
    console.log("Calculating stats...")
    const stats = document.getElementById("stats");
    stats.innerHTML = "Calculating..."


    const time = totalTime(songs);
    const sortedSongs = topSongs(songs);
    const sortedArtists = topArtists(songs);
    stats.innerHTML = `Your total listening time is: ${timeFormatter(time)}!<br>
    That's ~${msToHours(time)} or ~${msToDays(time)}!<br>
    Your top song is ${sortedSongs[0][0]} with ${sortedSongs[0][1]} listens!<br>
    Your top artist is ${sortedArtists[0][0]} with ${sortedArtists[0][1]} listens!`
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

    for (const song of songs) {
        topSongs[song.master_metadata_track_name] = (topSongs[song.master_metadata_track_name] || 0) + 1; 
    }

    const sortedSongs = Object.entries(topSongs)
        .sort(([, countA], [, countB]) => countB - countA);

    console.log("Top songs calculated.");
    return sortedSongs;
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
