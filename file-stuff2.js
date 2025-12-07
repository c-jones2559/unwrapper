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
document.getElementById('processBtn').addEventListener('click', async () => {
    const inputElement = document.getElementById('input');

    if (!inputElement.files.length) {
        alert("Hold on, you haven't selected any files yet!");
        return;
    }

    try {
        // Innovative bit: Convert the FileList to an Array, map to Promises, and await them all at once
        const promises = Array.from(inputElement.files).map(readJsonFile);
        const combinedData = await Promise.all(promises);

        // Now you have an ARRAY of objects.
        // Access it like: combinedData[0].content.name
        console.log("Sorted. Here's your data:", combinedData);
        let songs = [];
        for (file of combinedData) {
            songs.push(file);
            console.log(`${file} added to songs.`);
        }
        checkValid (songs);

        // If you absolutely MUST merge them into one giant object (risky business):
        // const mergedObj = Object.assign({}, ...combinedData.map(d => d.content));

    } catch (error) {
        console.error("It's all gone pear-shaped:", error);
    }
});

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
    console.log("Checking valid...")
    for (let i = 0; i < songs.length; i++) {
        console.log(`Song ${i}: ${song[i].master_metadata_track_name}`)
    }
}

