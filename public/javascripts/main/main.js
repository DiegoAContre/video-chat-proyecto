$(function () {
  const uvm = "@uvm.edu.ve";
  const inputsIDS = ["titulo", "descripcion", "correo", "id", "nombre", "apellido", "cedula", "carrera", "correo1", "id1", "nombre1", "apellido1", "cedula1", "carrera1", "idjuez", "cjuez", "njuez", "ajuez", "idjuez1", "cjuez1", "njuez1", "ajuez1", "idjuez2", "cjuez2", "njuez2", "ajuez2"];
  const inputsValues = ["titulo", "descripcion", "idd", "nd", "ad", "cid", "cod", "cad", "idd1", "nd1", "ad1", "cid1", "cod1", "cad1", "idj", "nj", "aj", "cj", "idj1", "nj1", "aj1", "cj1", "idj2", "nj2", "aj2", "cj2", "check"];

  $('#codigo').keyup(function(){
    let search = $('#codigo').val();
    let template = '';
    if(search!==''){
      $.ajax({
        url: '/entrar',
        method: 'PUT',
        data: {search},
        success: function(response) {
          if (response!==0) {
            response.forEach(element => {
              template += `<option value="${element.codigo_tesis}">`
            });
            $('#browsers').html(template);
          } else {            
            $('#browsers').html(template);
          }
        }
      });
    }else{
      $('#browsers').html(template);
    }
  });

  $('#entrar').on('submit', (e) => {
    e.preventDefault();
    let DataQuery = {
      codigo: $('#codigo').val().trim(),
      opcion: $('#opcion').val().trim(),
      usuario: $('#usuario').val().trim()+uvm,
    };
    if (DataQuery.opcion==0) {
      Swal.fire({
        icon: 'info',
        title: 'Selecciona la función',
        text: 'Debes escoger la función para entrar'
      });
    }else{
      $.ajax({
        url: '/entrar',
        method: 'POST',
        data: DataQuery,
        success: function(response) {
          if (response!==0) {
            $('#entrar').trigger('reset');
            window.location = response;
          }else{
            Swal.fire({
              icon: 'warning',
              title: 'Datos Incorrectos',
              text: 'Verifica el usuario/código y el tipo de usuario'
            });
          }                
        }
      });  
    }
  });
  
  $('#crear').on('click', async (e) => {
    e.preventDefault();
    let DataQuery = { titulo: $('#titulo').val().trim(), descripcion: $('#descripcion').val().trim(), idd: $('#id').val().trim(), nd: $('#nombre').val().trim(), ad: $('#apellido').val().trim(), cid: $('#cedula').val().trim(), cod: $('#correo').val().trim()+uvm, cad: $('#carrera').val().trim(), idd1: $('#id1').val().trim(), nd1: $('#nombre1').val().trim(), ad1: $('#apellido1').val().trim(), cid1: $('#cedula1').val().trim(), cod1: $('#correo1').val().trim()+uvm, cad1: $('#carrera1').val().trim(), idj: $('#idjuez').val().trim(), nj: $('#njuez').val().trim(), aj: $('#ajuez').val().trim(), cj: $('#cjuez').val().trim()+uvm, idj1: $('#idjuez1').val().trim(), nj1: $('#njuez1').val().trim(), aj1: $('#ajuez1').val().trim(), cj1: $('#cjuez1').val().trim()+uvm, idj2: $('#idjuez2').val().trim(), nj2: $('#njuez2').val().trim(), aj2: $('#ajuez2').val().trim(), cj2: $('#cjuez2').val().trim()+uvm, check: $('#checked').val().trim() };
    if(DataQuery.titulo==''){
      Swal.fire({
        icon: 'warning',
        title: 'Ingresa un titulo',
        text: 'Es necesario incluir el titulo del proyecto de la sala'
      });
    }else{
      if (DataQuery.idd=='') {
        var newid = '';
        let newDefensor = {
          nombre_defensor: DataQuery.nd,
          apellido_defensor: DataQuery.ad,
          cedula_defensor: DataQuery.cid,
          correo_defensor: DataQuery.cod,
          id_carrera_defensor: DataQuery.cad
        };
        $.ajax({
          url: '/incluir',
          method: 'POST',
          data: newDefensor,
          success: function(response) {          
            newid = response;
            DataQuery.idd = newid;
          }
        });
      }
      if(DataQuery.check==0){
        DataQuery.idd1 = 1;
      }else{
        if(DataQuery.idd1==''){
          var newid = '';
          let newDefensor = {
            nombre_defensor: DataQuery.nd1,
            apellido_defensor: DataQuery.ad1,
            cedula_defensor: DataQuery.cid1,
            correo_defensor: DataQuery.cod1,
            id_carrera_defensor: DataQuery.cad1
          };
          $.ajax({
            url: '/incluir',
            method: 'POST',
            data: newDefensor,
            success: function(response) {          
              newid = response;
              DataQuery.idd1 = newid;
            }
          });  
        }
      }
      if(DataQuery.idj==''){
        var newid = '';
        let newJuez = {
          nombre_juez: DataQuery.nj,
          apellido_juez: DataQuery.aj,
          correo_juez: DataQuery.cj,
        };
        $.ajax({
          url: '/incluir',
          method: 'PUT',
          data: newJuez,
          success: function(response) {          
            newid = response;
            DataQuery.idj = newid;
          }
        });   
      }
      if(DataQuery.idj1==''){  
        var newid = '';
        let newJuez = {
          nombre_juez: DataQuery.nj1,
          apellido_juez: DataQuery.aj1,
          correo_juez: DataQuery.cj1,
        };
        $.ajax({
          url: '/incluir',
          method: 'PUT',
          data: newJuez,
          success: function(response) {          
            newid = response;
            DataQuery.idj1 = newid;
          }
        });       
      }
      if(DataQuery.idj2==''){ 
        var newid = '';
        let newJuez = {
          nombre_juez: DataQuery.nj2,
          apellido_juez: DataQuery.aj2,
          correo_juez: DataQuery.cj2,
        };
        $.ajax({
          url: '/incluir',
          method: 'PUT',
          data: newJuez,
          success: function(response) {          
            newid = response;
            DataQuery.idj2 = newid;
          }
        });        
      }
      let timerInterval
      Swal.fire({
        title: 'Creando Sala',
        html: 'Faltan <b></b> milisegundos para terminar.',
        timer: 12000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      });      
      setTimeout(() => {
        $.ajax({
          url: '/crear',
          method: 'POST',
          data: DataQuery,
          success: function(response) {
            $('#cerrar').click();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: response,
              text: 'Este es el codido de la sala',
              showConfirmButton: false,
              timer: 10000
            });
            inputsIDS.forEach(clearInput);
            $('#codigo').val(response);        
          },
          error : function(xhr, status) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al tratar de crear la sala, intente de nuevo (puede verificar los registro de los defensores y jurado).'
            });
          }
        });  
      }, 10000);  
    }
  });
  function clearInput(item) {
    if (item!="id1") {
      $("#"+item).val('');      
    } else {
      $("#"+item).val(1);      
    }    
  }
});