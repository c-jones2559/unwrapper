import { timeFormatter, msToDays, msToHours, sOnEnd } from './timeBits.js';

function calculateStats(songs) {
    console.log("Calculating stats...")
    const stats = document.getElementById("stats");
    stats.innerHTML = "Calculating..."


    const time = totalTime(songs);
    stats.innerHTML = `Your total listening time is: ${timeFormatter(time)}!<br>
    That's ~${msToHours(time)} or ~${msToDays(time)}!`;

    console.log("All stats calculated.")
}


function totalTime(songs) {
    console.log("Calculating time...")
    let total = 0
    for (const song of songs) {
        total += song.ms_played
    }
    console.log("Time calculated.")
    return total;
}
