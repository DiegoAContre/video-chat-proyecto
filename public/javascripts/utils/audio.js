socket.on('guest-audio', (guestAudio, username, socketID) => {  
    if (guestAudio==true) {
        outputGuest(guestAudio, username, socketID);
    } else {
        $("#"+socketID).remove();
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: username+' ha desactivado su micrófono',
            showConfirmButton: false,
            timer: 1500
        });  
    }    
});

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});

function outputGuest(guestAudio, username, socketID) {
    const li = document.createElement('li');
    li.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center list-group-item-action");
    li.setAttribute("id", socketID);
    const small = document.createElement('small');
    small.innerText = username;
    li.appendChild(small);  
    const span = document.createElement('span');
    const div = document.createElement('div');
    div.setAttribute("class", "btn-group");
    const boton = document.createElement('button');
    boton.setAttribute("type", "button");    
    boton.setAttribute("name", socketID);
    boton.setAttribute("value", guestAudio);
    boton.setAttribute("onclick", "audioLI(value, name)");
    boton.setAttribute("class", "btn btn-warning btn-control "+socketID);
    boton.setAttribute("title", "Activar sonido de este invitado");
    const icono = document.createElement('i');
    icono.setAttribute("class", "fas fa-microphone-alt");
    boton.appendChild(icono);
    div.appendChild(boton);
    const boton1 = document.createElement('button');
    boton1.setAttribute("type", "button");
    boton1.setAttribute("name", socketID);
    boton1.setAttribute("value", false);
    boton1.setAttribute("onclick", "borrarLI(value, name)");
    boton1.setAttribute("class", "btn btn-danger");
    const icono1 = document.createElement('i');
    icono1.setAttribute("class", "fas fa-ban");
    boton1.appendChild(icono1);
    div.appendChild(boton1);
    span.appendChild(div);
    li.appendChild(span);
    document.querySelector('.list-group').appendChild(li);
}

function borrarLI(value, name) {
    socket.emit('control-audio', { value, name });
    $("#"+name).remove();
}

function muteALL() {
    socket.emit('mute-audio', value=false);
    $(".btn-control").removeClass("btn-success");
    $(".btn-control").addClass("btn-warning");
    $(".btn-control").attr("value", true);
    $(".btn-control").attr("title", "Activar sonido de este invitado");
}

function audioLI(value, name) {    
    socket.emit('control-audio', { value, name });
    if (value=="true") {
        $("."+name).attr({
            "class" : "btn btn-success btn-control "+name,
            "value" : false,
            "title" : "Desactivar sonido de este invitado"
        });            
    } else {
        $("."+name).attr({
            "class" : "btn btn-warning btn-control "+name,
            "value" : true,
            "title" : "Activar sonido de este invitado"
        });
    }    
}