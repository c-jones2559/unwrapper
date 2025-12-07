function calculateStats(songs) {
    console.log("Calculating stats...")
    const stats = document.getElementById("stats");
    stats.innerHTML = "Calculating..."

    stats.innerHTML = `Your total listening time is: ${totalTime(songs)}!`;

    console.log("All stats calculated.")
}

function timeFormatter(ms) {
    let s=0, m=0, h=0, d=0;
    while (ms > 1000) {
        s++;
        ms-=1000;
    }
    while (s > 60) {
        m++;
        s-=60;
    }
    while (m > 60) {
        h++;
        m-=60;
    }
    while (h > 24) {
        d++;
        h-=24;
    }
    let output = ""
    if (d > 0) {output += `${d} days, `}
    if (h > 0) {output += `${h} hours, `}
    if (m > 0) {output += `${m} minutes, `}
    if (s > 0) {output += `${s} seconds, `}
    output += `${ms} milliseconds`
    
    return output;
}

function totalTime(songs) {
    console.log("Calculating time...")
    let total = 0
    for (const song of songs) {
        total += song.ms_played
    }
    console.log("Time calculated.")
    return timeFormatter(total);
}