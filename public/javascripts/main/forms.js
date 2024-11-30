$(document).ready(function(){
  $("#usur").hide();
  $("#esconder").hide();
  $("#opcion").change(function() { 
    let usur = $('#opcion').val();
    if(usur == 1|| usur == 2) { 
      $("#usur").show(500);
    } else {
      $("#usur").hide(500);
    }
  });
  $("#remember").change(function() { 
    if($(this).is(":checked")) { 
      $("#esconder").show(500);
      $('#checked').val("1");
      $('#correo1').attr("required","true");
      $('#nombre1').attr("required", "true");
      $('#apellido1').attr("required", "true");
      $('#cedula1').attr("required", "true");
    } else {                
      $("#esconder").hide(500);
      $('#checked').val("0");
      $('#correo1').removeAttr("required","true");
      $('#nombre1').removeAttr("required","true");
      $('#apellido1').removeAttr("required","true");
      $('#cedula1').removeAttr("required","true");
    }
  });
    
  $("#search-correo").click(function(){
    let search = $('#correo').val()+"@uvm.edu.ve";
    $.ajax({
      url: '/form',
      method: 'POST',
      data: {search},
      success: function(response){
        if (response!==0) {            
          $('#id').val(response[0].id_defensor);
          $('#nombre').val(response[0].nombre_defensor);
          $('#nombre').attr("disabled","disabled");
          $('#apellido').val(response[0].apellido_defensor);
          $('#apellido').attr("disabled","disabled");
          $('#cedula').val(response[0].cedula_defensor);
          $('#cedula').attr("disabled","disabled");
          $('#carrera').val(response[0].id_carrera_defensor);
          $('#carrera').attr("disabled","disabled");
        } else {
          $('#id').val('');
          $('#nombre').val('');
          $('#nombre').removeAttr("disabled","disabled");
          $('#apellido').val('');
          $('#apellido').removeAttr("disabled","disabled");
          $('#cedula').val('');
          $('#cedula').removeAttr("disabled","disabled");
          $('#carrera').val('');
          $('#carrera').removeAttr("disabled","disabled");
          Swal.fire({
            icon: 'error',
            title: 'No registrado',
            text: 'Este correo no se encuentra registrado (revisa el correo)'
          });
        }
      }
    });
  });
  $("#search-correo1").click(function(){
      let search = $('#correo1').val()+"@uvm.edu.ve";
      $.ajax({
        url: '/form',
        method: 'POST',
        data: {search},
        success: function(response){
          if (response!==0) {            
            $('#id1').val(response[0].id_defensor);
            $('#nombre1').val(response[0].nombre_defensor);
            $('#nombre1').attr("disabled","disabled");
            $('#apellido1').val(response[0].apellido_defensor);
            $('#apellido1').attr("disabled","disabled");
            $('#cedula1').val(response[0].cedula_defensor);
            $('#cedula1').attr("disabled","disabled");
            $('#carrera1').val(response[0].id_carrera_defensor);
            $('#carrera1').attr("disabled","disabled");
          } else {
            $('#id1').val('');
            $('#nombre1').val('');
            $('#nombre1').removeAttr("disabled","disabled");
            $('#apellido1').val('');
            $('#apellido1').removeAttr("disabled","disabled");
            $('#cedula1').val('');
            $('#cedula1').removeAttr("disabled","disabled");
            $('#carrera1').val('');
            $('#carrera1').removeAttr("disabled","disabled");
            Swal.fire({
              icon: 'error',
              title: 'No registrado',
              text: 'Este correo no se encuentra registrado (revisa el correo)'
            });
          }
        }
      });
  });  

  $("#search-juez").click(function(){
    let search = $('#cjuez').val()+"@uvm.edu.ve";
    $.ajax({
      url: '/form',
      method: 'PUT',
      data: {search},
      success: function(response){
        if (response!==0) {            
          $('#idjuez').val(response[0].id_juez);
          $('#njuez').val(response[0].nombre_juez);
          $('#njuez').attr("disabled","disabled");
          $('#ajuez').val(response[0].apellido_juez);
          $('#ajuez').attr("disabled","disabled");
        } else {
          $('#idjuez').val('');
          $('#njuez').val('');
          $('#njuez').removeAttr("disabled","disabled");
          $('#ajuez').val('');
          $('#ajuez').removeAttr("disabled","disabled");
          Swal.fire({
            icon: 'error',
            title: 'No registrado',
            text: 'Este correo no se encuentra registrado (revisa el correo)'
          });
        }
      }
    });
  });
  $("#search-juez1").click(function(){
    let search = $('#cjuez1').val()+"@uvm.edu.ve";
    $.ajax({
      url: '/form',
      method: 'PUT',
      data: {search},
      success: function(response){
        if (response!==0) {            
          $('#idjuez1').val(response[0].id_juez);
          $('#njuez1').val(response[0].nombre_juez);
          $('#njuez1').attr("disabled","disabled");
          $('#ajuez1').val(response[0].apellido_juez);
          $('#ajuez1').attr("disabled","disabled");
        } else {
          $('#idjuez1').val('');
          $('#njuez1').val('');
          $('#njuez1').removeAttr("disabled","disabled");
          $('#ajuez1').val('');
          $('#ajuez1').removeAttr("disabled","disabled");
          Swal.fire({
            icon: 'error',
            title: 'No registrado',
            text: 'Este correo no se encuentra registrado (revisa el correo)'
          });
        }
      }
    });
  });
  $("#search-juez2").click(function(){
    let search = $('#cjuez2').val()+"@uvm.edu.ve";
    $.ajax({
      url: '/form',
      method: 'PUT',
      data: {search},
      success: function(response){
        if (response!==0) {            
          $('#idjuez2').val(response[0].id_juez);
          $('#njuez2').val(response[0].nombre_juez);
          $('#njuez2').attr("disabled","disabled");
          $('#ajuez2').val(response[0].apellido_juez);
          $('#ajuez2').attr("disabled","disabled");
        } else {
          $('#idjuez2').val('');
          $('#njuez2').val('');
          $('#njuez2').removeAttr("disabled","disabled");
          $('#ajuez2').val('');
          $('#ajuez2').removeAttr("disabled","disabled");
          Swal.fire({
            icon: 'error',
            title: 'No registrado',
            text: 'Este correo no se encuentra registrado (revisa el correo)'
          });
        }
      }
    });
  });
});