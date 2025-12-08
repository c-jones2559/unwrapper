function calculateStats(songs) {
    console.log("Calculating stats...")
    const stats = document.getElementById("stats");
    stats.innerHTML = "Calculating..."


    const time = totalTime(songs);
    stats.innerHTML = `Your total listening time is: ${timeFormatter(time)}!<br>
    That's ~${msToHours(time)} hours or ~${msToDays(time)} days!`;

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
function timeFormatter(ms) {
    let s=0, m=0, h=0, d=0, y=0;
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
    while (d > 365) {
        y++;
        d-=365;
    }
    let output = ""

    if (y > 0) {output += `${y} year${sOnEnd(y)}, `}
    if (d > 0) {output += `${d} day${sOnEnd(d)}, `}
    if (h > 0) {output += `${h} hour${sOnEnd(h)}, `}
    if (m > 0) {output += `${m} minute${sOnEnd(m)}, `}
    if (s > 0) {output += `${s} second${sOnEnd(s)}, `}
    output += `${ms} millisecond${sOnEnd(ms)}`
    
    return output;
}
function sOnEnd(num) {
    if (num == 1) {return ""} else {return "s"}
}
function msToHours(ms) {
    let hours = 0
    while (ms > (1000*60*60)) {
        hours++;
        ms -= (1000*60*60);
    }
    let hoursStr = hours.toLocaleString();

    return hoursStr;
}
function msToDays(ms) {
    let days = 0
    while (ms > (1000*60*60*24)) {
        days++;
        ms -= (1000*60*60*24);
    }
    let daysStr = days.toLocaleString();

    return daysStr;
}
