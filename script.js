const myAudio = document.getElementById('myAudio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const cover = document.getElementById('cover');
const musicContainer = document.getElementById('music-container');

let channelList;
let mp3ChannelList = [];
let imageList = [];
let channelIndex = 0;
let channelsUrl = "https://api.sr.se/api/v2/channels?format=json&indent=true&pagination=false";
//let channelsUrl = "http://api.sr.se/api/v2/playlists/rightnow?format=json&channelid=2576";

// Check if Playing
let isPlaying = false;

// Getting all the channels info
async function getRadioChannels() {
    try {
      let response = await fetch(channelsUrl);
      let result = await response.json();
      
      console.log("Channels output :", result.channels);  
      return result.channels;
  
    } catch (error) {
      console.log("error :", error);
    }
  }

// Loading the Radio Station
async function loadStation() {

    channelList = await getRadioChannels();

    channelList.map((channel)=>{
      mp3ChannelList.push(channel.liveaudio.url); // mapping live audio url
      imageList.push(channel.image);// mapping Images
     });     
     
     playChannel();
     
}

// Starting the station
loadStation();

// Play Channel
function playChannel() {
    isPlaying = true;
    musicContainer.classList.add('play');
    
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    
    myAudio.src = mp3ChannelList[channelIndex];  
    myAudio.play();

    cover.src = imageList[channelIndex];

    console.log(myAudio.src);  
    let channelNo = myAudio.src.substring(
      mp3ChannelList[channelIndex].indexOf("srapi/") + 6, 
      mp3ChannelList[channelIndex].lastIndexOf(".mp3")
      
    );
    
    console.log("channelNo = ", channelNo);
    console.log("channelIndex = ", channelIndex);
    title.innerText = "Channel  " + channelNo;
  }


// Pause Channel
function pauseChannel() {
    isPlaying = false;
    musicContainer.classList.remove('play');
    
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    myAudio.pause();
  }
 
// Event Listeners
playBtn.addEventListener('click', () => (isPlaying ? pauseChannel() : playChannel()));
prevBtn.addEventListener('click', prevChannel);
nextBtn.addEventListener('click', nextChannel);
progressContainer.addEventListener('click', setProgress);
myAudio.addEventListener('ended', nextChannel);
// myAudio.addEventListener('timeupdate', updateProgress);


// Next Channel
function nextChannel() {  
    channelIndex++;

    if (channelIndex > mp3ChannelList.length - 1) {
      channelIndex = 0;
    }
    playChannel();
}

// Previous Channel
function prevChannel() {  
    channelIndex--;

    if ( channelIndex < 0 ) {
      channelIndex = mp3ChannelList.length - 1;
    }
    playChannel();
}


// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    console.log("myAudio.duration = ", myAudio.duration);
    console.log("currentTime = ", currentTime);
    console.log("e.srcElement = ", e.srcElement);
  }
  

