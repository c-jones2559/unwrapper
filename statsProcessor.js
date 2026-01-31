import { timeFormatter, msToDays, msToHours, sOnEnd } from './timeBits.js';

export function calculateStats(songs) {
    console.log("Calculating stats...")
    const stats = document.getElementById("stats");
    stats.innerHTML = "Calculating..."


    const time = totalTime(songs);
    const sortedSongs = topSongs(songs);
    stats.innerHTML = `Your total listening time is: ${timeFormatter(time)}!<br>
    That's ~${msToHours(time)} or ~${msToDays(time)}!<br>
    Your top song is ${sortedSongs[0][0]} with ${sortedSongs[0][1]} listens!`
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
