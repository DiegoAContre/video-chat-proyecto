const videoGrid = document.getElementById('video-grid');
const shareGrid = document.getElementById('video-share');
const newHref = document.getElementById('redirect');
const btnSound = document.getElementById('btn-sound');
const iSound = document.getElementById('icon-sound');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

newHref.setAttribute("href", "share?room="+room);
const socket = io('/')
let myPeer = null;
const myVideo = document.createElement('video');
myVideo.setAttribute("id", "student");
myVideo.muted = true;
var myStream = null;
var myAudio = false;
const peers = {};
navigator.mediaDevices.getUserMedia({
  video: {
    width: { min: 426, ideal: 640, max: 1280 },
    height: { min: 240, ideal: 480, max: 720 },
  },
  audio: true,
}).then(stream => {
  myPeer = new Peer(undefined);
  addVideoStream(myVideo, stream);  
  myStream = stream;
  myStream.getAudioTracks()[0].enabled = false;

  myPeer.on('open', id => {
    socket.emit('join-video', room, id, "student");
  });

  myPeer.on('call', call => { 
    call.answer(stream);
    const video = document.createElement('video');
    video.setAttribute("id", call.metadata.type);
    if (call.metadata.type=="share") {
      call.on('stream', userVideoStream => {
        addShareStream(video, userVideoStream)
      })
    } else {
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    }
    call.on('close', () => {      
      video.remove();
    });
  });
  socket.on('user-connected', (userId, type) =>{    
    connectToNewUser(userId, stream, type);
    console.log("Nuevo usuario conectado..."+userId)
  });
  socket.on('share-connected', userId=>{
    shareANewScreen(userId, stream);
    console.log("Pantalla compartida por: "+ userId);
  });  
});

socket.emit('joinRoom', { username, room });

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
});

socket.on('share-disconnected', userId => {
  console.log("Paso");
  if (peers[userId]) peers[userId].close();
});

function connectToNewUser(userId, stream, type) {  
  const call = myPeer.call(userId, stream, {
    metadata: {"type":"student"}
  });
  const video = document.createElement('video');
  video.setAttribute("id", type);
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  })
  call.on('close', () => {
    video.remove();
    console.log('Usuario desconectado..."',userId)
  })
  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {    
    video.play()
  })
  videoGrid.append(video)
}

function shareANewScreen(userId, stream) { 
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  video.setAttribute("id", "share");  
  
  call.on('stream', userVideoStream => {
    addShareStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove();
    console.log('Compartir pantalla finalizado por: ',userId)
  })
  peers[userId] = call
}

function addShareStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  shareGrid.append(video)
}

function audioMic() {
  btnSound.removeAttribute("class");
  iSound.removeAttribute("class");  
  if (myAudio==true) {
    myStream.getAudioTracks()[0].enabled = false;
    myAudio=false;
    btnSound.setAttribute("class", "btn btn-warning w-40");
    btnSound.setAttribute("title", "Activar el microfono")
    iSound.setAttribute("class", "fas fa-volume-mute me-2");
  } else {
    myStream.getAudioTracks()[0].enabled = true;
    myAudio=true;   
    btnSound.setAttribute("class", "btn btn-success w-40 text-dark");
    btnSound.setAttribute("title", "Desactivar el microfono")
    iSound.setAttribute("class", "fas fa-volume-up me-2");
  }
}