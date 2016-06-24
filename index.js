var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var redis = require('redis');
var redisClient = redis.createClient();

// Included for dev environment to clear out old messages upon load
// Uncomment to delete messages key
//redisClient.del('messages');


app.use(express.static('public'));

io.on('connection', function (socket) {
  console.log('new user');
  redisClient.lrange('messages', 0, -1, function (err, result) {
    if (result && result.length) {
      result.forEach(function (message) {
        socket.emit('chat message', message);
      }); 
    }
  });
  
  socket.on('nickname', function (name) {
    socket.nickname = name;
    socket.broadcast.emit('new user', socket.nickname);
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('bye user', socket.nickname);
  });
  
  socket.on('chat message', function (message) {
    var messageObj = JSON.stringify({
      name: socket.nickname,
      message: message
    });
    socket.broadcast.emit('chat message', messageObj);
    redisClient.lpush(['messages', messageObj], function (err, reply) {
      if (reply > 20) {
        redisClient.ltrim('messages', 0, 19);
      }
    });
  });
});

server.listen(3030, function () {
  console.log('Listening on: 3030');
});
