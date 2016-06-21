var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var redis = require('redis');
var redisClient = redis.createClient();

/*
  Check how Sockets.io is listening to the server
  Maybe set the port on app 
    Then use io.listen(server) ???
  
  currently redisClient.lrange returns null...
  callback function can be added to redisClient.lpush 
    Add console.log there and test files again
*/


app.use(express.static('public'));

io.on('connection', function (socket) {
  console.log('new user');
  redisClient.lrange('messages', 0, -1, function (result) {
    console.log('redis ', result);
    if (result && result.length) {
      result.forEach(function (message) {
        console.log('redis: ', message);
        socket.emit('chat message', JSON.parse(message));
      }); 
    }
  });
  
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
    redisClient.lpush('messages', JSON.stringify(messageObj));
  });
});

server.listen(3030, function () {
  console.log('Listening on: 3030');
});
