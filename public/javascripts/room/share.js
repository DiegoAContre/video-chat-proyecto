const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const shareGrid = document.getElementById("share");
const btnSound = document.getElementById('btn-sound');
const iSound = document.getElementById('icon-sound');
const socket = io('/');
const gdmOptions = {
  video: {
    displaySurface: "window",
    logicalSurface: true
  },
  width: { min: 426, ideal: 854, max: 1280 },
  height: { min: 240, ideal: 480, max: 720 },
  audio: false,
  surfaceSwitching: "include",
  selfBrowserSurface: "exclude",
  systemAudio: "exclude"
};
const { room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
let sharePeer = new Peer(undefined);
const sharepeers = {};
var shareStream = null;
var shareTrack = null;
var reconnect = 1;

sharePeer.on('open', id => {
  userId = id;
  console.log('Listo para trasmitir como: '+userId);
});

startElem.addEventListener("click", async (e) => {
  if (reconnect>1) {
    sharePeer = new Peer(undefined);
    sharePeer.on('open', id => {
      userId = id;
      console.log('Listo para trasmitir por '+reconnect+' vez: '+userId);
    });
    await navigator.mediaDevices.getDisplayMedia(gdmOptions).then(stream => {
      shareStream = stream;
      shareTrack = shareStream.getVideoTracks()[0];
      addShareStream(shareStream);
      socket.connect();  
      socket.emit('share-video', room, userId);      
    });        
    sharePeer.on('call', call => {
      call.answer(shareStream);
      call.on('stream', userVideoStream => {
        let testing = userVideoStream;
      })
    }); 
    shareTrack.onended = function() {
      reconnect = reconnect+1;
      stopCapture();
      sharePeer.destroy();
      sharePeer = null;
      socket.disconnect();
    }; 
  }else{
    await navigator.mediaDevices.getDisplayMedia(gdmOptions).then(stream => {
      shareStream = stream;
      shareTrack = shareStream.getVideoTracks()[0];
      addShareStream(shareStream);
      socket.connect();
      socket.emit('share-video', room, userId); 
    });     
    shareTrack.onended = function() {
      reconnect = reconnect+1;
      stopCapture();
      sharePeer.destroy();
      sharePeer = null;
      socket.disconnect();
    };
  }  
});

sharePeer.on('call', call => {
  call.answer(shareStream);
  call.on('stream', userVideoStream => {
    let testing = userVideoStream;
  })
}); 

socket.on('user-connected', (userId, type) =>{    
  shareANewScreen(userId, shareStream);
  console.log("Nuevo usuario conectado..."+userId+" como:"+type)
});

function shareANewScreen(userId, shareStream) {  
  const call = sharePeer.call(userId, shareStream, {
    metadata: {"type":"share"}
  });
  call.on('stream', userVideoStream => {
    let testing = userVideoStream;
  })
  call.on('close', () => {
    console.log('Compartir pantalla finalizado para: ',userId)
  })
  sharepeers[userId] = call
}

function addShareStream(stream) {
  shareGrid.srcObject = stream
  shareGrid.addEventListener('loadedmetadata', () => {
    shareGrid.muted = true;
    shareGrid.play()
  })
}

stopElem.addEventListener("click", (evt) => {
  reconnect = reconnect+1;
  stopCapture();
  sharePeer.destroy();
  sharePeer = null;
  socket.disconnect();
}, false);

function stopCapture(evt) {  
  let tracks = shareGrid.srcObject.getTracks();

  tracks.forEach((track) => track.stop());
  shareGrid.srcObject = null;
}