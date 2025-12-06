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

function checkValid () {
   console.log("checkValid running...")
   const fileList = document.getElementById("input");
   const fileArray = [...fileList.files];
   const fileArrayObjs = fileArray.map(readJSONFile)
   const valid = document.getElementById("valid");

   if (fileArray.length === 0) {
      console.log("No files selected.")
      return;
  }

   for (const file of fileArrayObjs) {
      console.log(file);
      if (validFields.includes(file)) {
         continue;
      } else {
         console.error("Files invalid.");
         valid.innerHTML = "Invalid, please enter a different file. See help for more details. (help hasn't been implemented yet)";
         return;
      }
   }
   console.log("Files valid.");
   valid.innerHTML = "Valid file, processing. (this won't do anything yet)";
   return;
}