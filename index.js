var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', function (socket) {
  
  socket.on('nickname', function (name) {
    socket.nickname = name;
    socket.broadcast.emit('new user', socket.nickname);
  });

  socket.on('disconnect', function () {
    console.log('Goodbye user!');
  });
  
  socket.on('chat message', function (message) {
    var messageObj = {
      name: socket.nickname,
      message: message
    };
    socket.broadcast.emit('chat message', messageObj);
  });
});

server.listen(3030, function () {
  console.log('Listening on: 3030');
});
