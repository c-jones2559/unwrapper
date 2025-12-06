var getKeys = function(obj){
    var keys = [];
    for(var key in obj){
        keys.push(key);
    }
    return keys;
}

const obj = { word: 'Defenestrate', definition: 'To throw a person out of a window' };
const keys = Object.keys(obj); // ['word', 'definition']


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

function readJSONFile(file) {
    console.log(`Reading json file: ${file.name}`)
    const reader = new FileReader();

    reader.onload = function(event) {
        const jsonString = event.target.result;

        try {
            const jsonObject = JSON.parse(jsonString);
            processJsonObject(jsonObject, file.name);
        } catch (e) {
            console.error `Unable to parse file ${file.name}.`;
        }

    }

    reader.readAsText(file);
}



async function checkValid () {
    console.log("checkValid running...")
    const fileInput = document.getElementById("input");
    const fileArray = [...fileInput.files];

    if (fileArray.length === 0) {
        console.log("No files selected.")
        return;
    }

    const processedObjs = await processAllFiles(fileArray);
    const valid = document.getElementById("valid");

    
    for (const file of processedObjs) {
        console.log(`File contents: ${file}, ${file.name}`);

        for (const record of getKeys(file)) {
            console.log(`Record: ${record}, ${record.name}`)

            const recordKeys = Object.keys(record);
            for (const key of recordKeys) {
                console.log(`Key: ${key}, ${key.name}`)
                if (validFields.includes(key.name)) {
                    continue;
                } else {
                    console.error("Files invalid.");
                    valid.innerHTML = "Invalid, please enter a different file. See help for more details. (help hasn't been implemented yet)";
                    return;
                }
            }
        }
        
    }
    console.log("Files valid.");
    valid.innerHTML = "Valid file, processing. (this won't do anything yet)";
    return;
}

function readFilePromise(file) {
     return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file);
     });
}

async function processAllFiles(filesArray) {
     const promiseArray = filesArray.map(readFilePromise);

     try {
          const rawJsonResults = await Promise.all(promiseArray);
          const finalJsonObjects = rawJsonResults.map(rawString => JSON.parse(rawString));
          console.log("ALL JSON DATA READY:", finalJsonObjects);
          return finalJsonObjects;

     } catch (e) {
          console.error("A file operation failed:", e);
     }
}