const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const chat = require('../views/partials/chat');
const modal = require('../views/partials/modal')
 
router.get('/student', async function(req, res, next) {
  res.render('layouts/room/student', { 
    title: 'Interfaz de la sala (estudiante)',
  });
});

router.get('/share', async function(req, res, next) {
  res.render('layouts/room/share', { 
    title: 'Preview Compartir',
  });
});

router.get('/guest', function(req, res, next) {
  res.render('layouts/room/guest', { 
    title: 'Interfaz de la sala para los invitados',
    modal    
  });
});

router.get('/judge', function(req, res, next) {
  res.render('layouts/room/judge', { 
    title: 'Interfaz de la sala (Profesor)',
    chat,
    modal
  });
});

router.post('/data', async (req, res) => {
  const room = req.body.room;
  var response = null;
  const mostrar = await pool.query('SELECT * FROM `tesis` WHERE `id_tesis` = ?', [room]);
  response = mostrar == '' ? 0 : mostrar;
  res.json(response);
});

router.post('/dataJ', async (req, res) => {
  const { prijuez_tesis, segjuez_tesis, terjuez_tesis } = req.body;
  var response = null;
  const mostrar = await pool.query('SELECT * FROM `jueces` WHERE `id_juez`=? OR `id_juez`=? OR `id_juez`=?', [prijuez_tesis, segjuez_tesis, terjuez_tesis]);
  response = mostrar == '' ? 0 : mostrar;
  res.json(response);
});

router.put('/data', async (req, res) => {
  const { pridefensor_tesis, segdefensor_tesis } = req.body;
  var response = null;
  const mostrar = await pool.query('SELECT * FROM `defensores` LEFT JOIN `carreras` ON `id_carrera_defensor` = `id_carrera` WHERE `id_defensor`=? OR `id_defensor`=?', [pridefensor_tesis, segdefensor_tesis]);
  response = mostrar == '' ? 0 : mostrar;
  res.json(response);
});

module.exports = router;