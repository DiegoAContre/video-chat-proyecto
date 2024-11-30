const express = require('express');
const router = express.Router();
const uuid = require('uuid')

const pool = require('../datebase');
const form = require('../views/partials/form');
const entrar = require('../views/partials/entrar');

router.get('/', async (req, res, next) => {
  res.render('layouts/main', { 
    title: 'Auxiliar de presentaciones virtual',
    form,
    entrar
  });
});

router.post('/form', async (req, res) => {
  const search = req.body.search;
  var response = '';
  const entrar = await pool.query('SELECT * FROM `defensores` WHERE `correo_defensor` = ?', [search]);
  response = entrar == '' ? 0 : entrar;
  res.json(response);
});
router.put('/form', async (req, res) => {
  const search = req.body.search;
  var response = '';
  const entrar = await pool.query('SELECT * FROM `jueces` WHERE `correo_juez` = ?', [search]);
  response = entrar == '' ? 0 : entrar;
  res.json(response);
});

router.post('/incluir', async (req, res) => {
  let newDefensor = req.body;
  const incluir = await pool.query('INSERT INTO `defensores` set ?', [newDefensor]);
  var response = incluir;
  res.json(response.insertId);
});
router.put('/incluir', async (req, res) => {
  let newJuez = req.body;
  const incluir = await pool.query('INSERT INTO `jueces` set ?', [newJuez]);
  var response = incluir;
  res.json(response.insertId);
});

router.post('/crear', async (req, res) => {
  const { titulo, descripcion, idd, idd1, idj, idj1, idj2 } = req.body;
  let newRoom = {
    titulo_tesis: titulo,
    descripcion_tesis: descripcion,
    pridefensor_tesis: idd,
    segdefensor_tesis: idd1,
    prijuez_tesis: idj,
    segjuez_tesis: idj1,
    terjuez_tesis: idj2,
    codigo_tesis: uuid.v4().substring(0,13)
  };
  const crear = await pool.query('INSERT INTO `tesis` set ?', [newRoom]);
  var response = newRoom.codigo_tesis;
  res.json(response);
});

router.put('/entrar', async (req, res) => {
  const search = "%"+req.body.search+"%";
  var response = '';
  const entrar = await pool.query('SELECT `codigo_tesis` FROM `tesis` WHERE `codigo_tesis` LIKE ?', [search]);
  response = entrar == '' ? 0 : entrar;
  res.json(response);
});
router.post('/entrar', async (req, res) => {
  const { codigo, opcion, usuario } = req.body;
  var url = 0;
  if (opcion==1) {
    const entrar = await pool.query('SELECT * FROM `defensores` LEFT JOIN `tesis` ON `id_defensor`=`pridefensor_tesis` OR `id_defensor`=`segdefensor_tesis` WHERE `correo_defensor`=? AND `codigo_tesis`=?', [usuario, codigo]);
    url = entrar == '' ? 0 : ('/room/student?room='+entrar[0].id_tesis+'&username='+entrar[0].nombre_defensor+'_'+entrar[0].apellido_defensor);
    } else {
    if (opcion==2) {
      const entrar = await pool.query('SELECT * FROM `jueces` LEFT JOIN `tesis` ON `id_juez`=`prijuez_tesis` OR `id_juez`=`segjuez_tesis` OR `id_juez`=`terjuez_tesis` WHERE `correo_juez`=? AND `codigo_tesis`=?', [usuario, codigo]);
      url = entrar == '' ? 0 : ('/room/judge?room='+entrar[0].id_tesis+'&username='+entrar[0].nombre_juez+'_'+entrar[0].apellido_juez);  
    } else {
      const entrar = await pool.query('SELECT * FROM `tesis` WHERE `codigo_tesis`=?', [codigo]);
      var username = uuid.v4().substring(0,18);
      url = entrar == '' ? 0 : ('/room/guest?room='+entrar[0].id_tesis+'&username='+username);
    }
  }
  res.json(url);
});

module.exports = router;