/**
 * The first two functions read the inputted json files.
 * I got AI to do it because I don't understand JS.
 * At the bottom of this file there's check valid which I made.
 * 
 * 
 */

// 1. Helper function to promise-ify the FileReader (makes life way easier)
const readJsonFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                // I'm attaching the filename too, so you know which file the data came from
                resolve({ 
                    sourceFile: file.name, 
                    content: json 
                }); 
            } catch (err) {
                reject(`That file (${file.name}) is proper knacked. Invalid JSON.`);
            }
        };
        
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};

// 2. The Event Listener
async function buttonClick() {
// document.getElementById('processBtn').addEventListener('click', async () => {
    const inputElement = document.getElementById('input');

    if (!inputElement.files.length) {
        alert("Hold on, you haven't selected any files yet!");
        return;
    }

    try {
        // Convert the FileList to an Array, map to Promises, and await them all at once
        const promises = Array.from(inputElement.files).map(readJsonFile);
        const combinedData = await Promise.all(promises);

        // Flatten all song objects from all files into one array
        let songs = [];
        for (const file of combinedData) {
            if (Array.isArray(file.content)) {
                songs = songs.concat(file.content);
            } else {
                songs.push(file.content);
            }
        }
        console.log("All songs:", songs);
        checkValid(songs);

        // If you absolutely MUST merge them into one giant object (risky business):
        // const mergedObj = Object.assign({}, ...combinedData.map(d => d.content));

    } catch (error) {
        console.error("It's all gone pear-shaped:", error);
    }
};

const validFields = [
    "ts",
    "platform",
    "ms_played",
    "conn_country",
    "ip_addr",
    "master_metadata_track_name",
    "master_metadata_album_artist_name",
    "master_metadata_album_album_name",
    "spotify_track_uri",
    "episode_name",
    "episode_show_name",
    "spotify_episode_uri",
    "audiobook_title",
    "audiobook_uri",
    "audiobook_chapter_uri",
    "audiobook_chapter_title",
    "reason_start",
    "reason_end",
    "shuffle",
    "skipped",
    "offline",
    "offline_timestamp",
    "incognito_mode"
]

function checkValid (songs) {
    console.log("Checking valid...");
    const valid = document.getElementById("valid");

    valid.innerHTML = "Checking file is valid, hold on a second...";


    for (let i = 0; i < songs.length; i++) {
        //console.log(`Song ${i}: ${songs[i].master_metadata_track_name}`);
        //console.log(`${Object.keys(`Keys: ${songs[i]}`)}`);
        if (i == 0) {
            console.log("[>-----------] 0%")
        } else if (i == songs.length/4) {
            console.log("[===>--------] 25%")
        } else if (i == songs.length/2) {
            console.log("[======>-----] 50%")
        } else if (i == songs.length/4*3) {
            console.log("[=========>--] 75%")
        } else if (i == songs.length) {
            console.log("[===========>] 99%")
        }
        
        for (const key of Object.keys(songs[i])) {        
            if (validFields.includes(key)) {
                continue;
            } else {
                console.error(`Files invalid. Found unexpected key: ${key}`);
                valid.innerHTML = "Invalid, please enter a different file. See help for more details. (help hasn't been implemented yet)";
                return;
            }
        }
        //console.log(`All keys valid for file ${i}.`);
    }
    console.log("[============] 100%");
    console.log("File valid!");
    valid.innerHTML = "Valid file, processing. (this won't do anything yet)";
    calculateStats(songs);
    return;
}

