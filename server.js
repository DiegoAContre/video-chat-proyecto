const createError = require('http-errors');
const http = require("http");
const path = require('path');
const express = require('express');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon');

//Inicializar la app
const app = express();
const server = http.createServer(app);

//Configuraciones de motor de visualizacion
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'index',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Configuraciones generales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'icon.ico')))

//Routers
const indexRouter = require('./routes/index');
const roomRouter = require('./routes/room');
app.use('/', indexRouter);
app.use('/room', roomRouter);

//En caso de Error
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

//Socket.io lado del servidor
const formatMessage = require("./public/javascripts/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
} = require("./public/javascripts/utils/users");
const io = require('socket.io')(server);
const botName = "ChatBot";
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "Bienvenido al chat de la sala"));
    socket.broadcast.to(user.room).emit(
      "message",
      formatMessage(botName, `${user.username} ha entrada a la sala`)
    );
  });

  socket.on('join-video',(room, userId, type)=>{
    console.log(`usuario: ${userId} ha entrado a ${room} como ${type}`);
    socket.join(room);
    socket.to(room).emit('user-connected', userId, type);
    socket.on("guest-audio", (guestAudio, username) => {       
      socket.to(room).emit('guest-audio', guestAudio, username, socket.id);
    });
    socket.on("mute-audio", (value) => {
      socket.to(room).emit('control-audio', value);
    });
    socket.on("control-audio", (value, name) => {      
      socket.to(value.name).emit('control-audio', value);
    });
    socket.on('disconnect', () => {
      console.log(`usuario: ${userId} ha salido de ${room}`);
      socket.to(room).emit('user-disconnected', userId);
    });
  });

  socket.on('share-video', (room, userId)=>{
    console.log(`usuario: ${userId} esta compartiendo pantalla en ${room}`);
    socket.join(room);
    socket.to(room).emit('share-connected',userId);
    socket.on('disconnect', () => {
      console.log(`usuario: ${userId} termino de compartir pantalla en ${room}`);
      socket.to(room).emit('user-disconnected', userId);
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} se ha salido de la sala`)
      );
    }
  });  
});

//Inicializacion del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`El servidor funciona en el puerto ${PORT}`));