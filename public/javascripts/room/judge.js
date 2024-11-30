const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const videoGrid = document.getElementById('video-grid');
const shareGrid = document.getElementById('video-share');
const btnSound = document.getElementById('btn-sound');
const iSound = document.getElementById('icon-sound');
const btnDetener = document.getElementById('recorderStop');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
let myPeer = null;
let mediaRecorder;
let streamRecorder;
let mediaAudioRecorder = [];
const myVideo = document.createElement('video');
myVideo.setAttribute("id", "judge");
myVideo.muted = true;
var myStream = null;
var myAudio = false;
const peers = {};
navigator.mediaDevices.getUserMedia({
  video: {
    width: { min: 426, ideal: 854, max: 1280 },
    height: { min: 240, ideal: 480, max: 720 },
  },
  audio: true,
}).then(stream => {
  myPeer = new Peer(undefined);
  addVideoStream(myVideo, stream);
  myStream = stream;
  myStream.getAudioTracks()[0].enabled = false;
  myStream.getVideoTracks()[0].enabled = false;

  myPeer.on('open', id => {
    socket.emit('join-video', room, id, "judge");
  });  

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    video.setAttribute("id", call.metadata.type);    
    if (call.metadata.type=="share") {
      call.on('stream', userVideoStream => {                
        addShareStream(video, userVideoStream);
      });
    } else {
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
      })
    };
    call.on('close', () => {      
      video.remove();
      btnDetener.click();
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

socket.on('message', (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if (!msg) {
    return false;
  }
  socket.emit('chatMessage', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.setAttribute("class", "d-flex align-items-center border-bottom  border-dark border-1 py-2");
  const div1 = document.createElement('div');
  div1.setAttribute("class", "w-100 ms-3");
  const div2 = document.createElement('div');
  div2.setAttribute("class", "d-flex w-100 justify-content-between");
  const h = document.createElement('h6');
  h.setAttribute("class", "mb-0");
  h.innerText = message.username;
  const small = document.createElement('small');
  small.innerText = message.time;
  div2.appendChild(h);  
  div2.appendChild(small);  
  div1.appendChild(div2);
  const span = document.createElement('span');
  span.innerText = message.text;
  div1.appendChild(span);
  div.appendChild(div1);  
  document.querySelector('.chat-messages').appendChild(div);
}

function connectToNewUser(userId, stream, type) {  
  const call = myPeer.call(userId, stream, {
    metadata: {"type":"judge"}
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
  videoGrid.append(video);
  mediaAudioRecorder.push(stream.getAudioTracks()[0]);
}

function shareANewScreen(userId, stream) {  
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  video.setAttribute("id", "share");
  call.on('stream', userVideoStream => {
    addShareStream(video, userVideoStream);
  })
  call.on('close', () => {
    video.remove();
    btnDetener.click();
    console.log('Compartir pantalla finalizado por: ',userId)
  })
  peers[userId] = call
}

function addShareStream(video, stream) {  
  streamRecorder = stream.getVideoTracks()[0];
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
    btnSound.setAttribute("title", "Activar el audio propio");
    iSound.setAttribute("class", "fas fa-volume-mute me-2");
  } else {
    myStream.getAudioTracks()[0].enabled = true;
    myAudio=true;   
    btnSound.setAttribute("class", "btn btn-success w-40 text-dark");
    btnSound.setAttribute("title", "Desactivar el audio propio");
    iSound.setAttribute("class", "fas fa-volume-up me-2");
  }
}