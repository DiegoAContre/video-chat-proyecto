const videoGrid = document.getElementById('video-grid');
const shareGrid = document.getElementById('video-share');
var guestAudio = true;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io('/');
let myPeer = null;
const myVideo = document.createElement('video');
myVideo.setAttribute("id", "guest");
myVideo.muted= true;
var myStream = null;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,  
}).then(stream => {
  myPeer = new Peer(undefined);
  addVideoStream(myVideo, stream)
  myStream = stream;
  myStream.getAudioTracks()[0].enabled = false;
  myStream.getVideoTracks()[0].enabled = false;

  myPeer.on('open', id => {
    socket.emit('join-video', room, id, "guest");
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

socket.on('control-audio', (value) => {
  console.log(value.value);
  if (value.value=="false") {  
    myStream.getAudioTracks()[0].enabled = false;
    $("#btn-sound").attr("class", "btn btn-warning");
    $("#btn-sound").attr("title", "Activar el microfono");
    guestAudio = true; 
  } else {
    if (value.value=="true") {
      $("#btn-sound").attr("class", "btn btn-success");
      $("#btn-sound").attr("title", "Desactivar el microfono");
      myStream.getAudioTracks()[0].enabled = true;
      guestAudio = false;
    } else {
      $("#btn-sound").attr("class", "btn btn-warning"); 
      $("#btn-sound").attr("title", "Activar el microfono");
      myStream.getAudioTracks()[0].enabled = false;
      guestAudio = true;
    }
  }  
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
});

function connectToNewUser(userId, stream, type) {  
  const call = myPeer.call(userId, stream, {
    metadata: {"type":"guest"}
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

function guestMic() {  
  if (guestAudio==true) {
    socket.emit('guest-audio', guestAudio, username);  
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: 'Haz solicitado activar tu micrófono',
      showConfirmButton: false,
      timer: 1500
    });  
  } else {
    socket.emit('guest-audio', guestAudio, username);  
    $("#btn-sound").attr("class", "btn btn-warning"); 
    myStream.getAudioTracks()[0].enabled = false;
  }
}