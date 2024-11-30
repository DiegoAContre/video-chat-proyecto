let recordedChunks = [];
var lastID = "";

$(function() {
    $("#recorderStart").click(function(){
        const audioContext = new AudioContext();        
        const dest = audioContext.createMediaStreamDestination();            
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        try {                                 
            mediaAudioRecorder.forEach(MediaStreamTrack => {
                if (lastID!=MediaStreamTrack.id) {
                    lastID=MediaStreamTrack.id;   
                    let mediaStream = new MediaStream();                 
                    mediaStream.addTrack(MediaStreamTrack);
                    let audioIn = audioContext.createMediaStreamSource(mediaStream);
                    audioIn.connect(dest);  
                }                
            });                                       

            oscillator.connect(dest);
            dest.stream.addTrack(streamRecorder);
            
            mediaRecorder = new MediaRecorder(dest.stream);   
            mediaRecorder.start();        
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            $("#recorderStart").hide();
            $("#recorderPause").show();
            $("#recorderStop").show();            
        } catch (error) {
            console.log(error);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'No hay pantalla compartida activada',
                showConfirmButton: false,
                timer: 1500
            });  
        }        
    });

    $("#recorderPause").click(function() {
        if (mediaRecorder.state === "recording") {
            mediaRecorder.pause();
            $("#recorderPause").attr("class", "btn btn-outline-info w-50");            
            $("#recorderPause").text("Reanudar");
        } else if (mediaRecorder.state === "paused") {
            mediaRecorder.resume();
            $("#recorderPause").attr("class", "btn btn-outline-warning w-50");            
            $("#recorderPause").text("Pausar");
        }
    });

    $("#recorderStop").click(function(){
        if (mediaRecorder.state!="inactive") {
            try {
                mediaRecorder.stop();        
                mediaRecorder.onstop = function() {
                    const blob = new Blob(recordedChunks, {
                    type: 'video/mp4'
                    });
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'recorded-call.mp4';
                    a.click();
                };
                $("#recorderStart").show();
                $("#recorderPause").hide();
                $("#recorderPause").attr("class", "btn btn-outline-warning w-50");
                $("#recorderPause").text("Pausar");
                $("#recorderStop").hide();  
            } catch (error) {
                console.log(error);
            }    
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'info',
                title: 'Ha finalizado el compartir pantalla',
                showConfirmButton: false,
                timer: 1500
            });  
        }
    });
});