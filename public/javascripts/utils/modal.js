$(function () {

    LeerDatos();

    function LeerDatos(){        
        let sala = null;
        let inicio = null;
        let jurado = null;
        let final = '';
        $.ajax({
            url: '/room/data',
            method: 'POST',
            data: {room},
            success: function(response){
                sala = response[0];   
                $("#codigo").text(sala.codigo_tesis);
                $("#titulo").text(sala.titulo_tesis);
                $("#descripcion").text(sala.descripcion_tesis);
                $.ajax({
                    url: '/room/dataJ',
                    method: 'POST',
                    data: sala,
                    success: function(response) {
                        jurado = "Prof. "+FirstLetter(response[0].nombre_juez)+" "+FirstLetter(response[0].apellido_juez)+" Tutor, Prof. "+FirstLetter(response[1].nombre_juez)+" "+FirstLetter(response[1].apellido_juez)+" Presidente del Jurado  y Prof. "+FirstLetter(response[2].nombre_juez)+" "+FirstLetter(response[2].apellido_juez)+" Jurado Principal";                        
                        $.ajax({
                            url: '/room/data',
                            method: 'PUT',
                            data: sala,
                            success: function(response){
                                var template = '';
                                response.forEach(element => {
                                    if(element.id_defensor>1){
                                        template +=`
                                        <div class="col">
                                            <div class="cardd">
                                                <h1>${FirstLetter(element.nombre_defensor)} ${FirstLetter(element.apellido_defensor)}</h1>
                                                <p class="title">${element.nombre_carrera}</p>
                                                <p>C.I: ${element.cedula_defensor}</p>                                                
                                            </div>
                                        </div>   
                                        `;
                                        final += "Nosotros, "+jurado+", designados como miembros del Jurado Examinador del Trabajo de Grado titulado: "+sala.titulo_tesis+" que presenta el bachiller: "+FirstLetter(FirstLetter(element.nombre_defensor))+" "+FirstLetter(element.apellido_defensor)+", portador de la C.I: Nº: "+element.cedula_defensor+", nos hemos reunido para revisar dicho trabajo y después de la presentación, defensa e interrogatorio correspondiente lo hemos calificado con: Nota en letra (nota en número) puntos, de acuerdo con las normas vigentes dictadas por el Consejo Universitario de la Universidad Valle del Momboy, referente a la evaluación de los Trabajos de Grado para optar al título de "+element.nombre_carrera+"                                                                                                                                                                     ";              
                                    }
                                });
                                inicio = "Bienvenidos a la defensa de la tesis "+sala.titulo_tesis+" presentado por @l/l@s estudiantes: la cual consiste en: "+sala.descripcion_tesis;
                                $("#defensor").html(template);
                                $("#discurso").val(inicio);
                                $("#veredicto").val(final);
                            }
                        });        
                    }
                });                 
            }
        });
    }

    function FirstLetter(sentence) {
        let words = sentence.split(" ").map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return words.join(" ");
    }    
});