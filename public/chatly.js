$(document).ready(function () {
  var socket = io();

  var $form = $('form'),
        $messageList = $('#message_list'),
        $newMessage = $('#new_message');
  
  // Nickname
  var nickname = null;
  while (nickname === null) {
    nickname = prompt("What's your nickname?");
  }
  socket.emit('nickname', nickname);
  appendNewUser('You');
  // End Nickname
  
  
  // Form Submission
  $form.submit(function (e) {
    e.preventDefault();
    socket.emit('chat message', $newMessage.val());
    appendMessage({
      message: $newMessage.val(),
      name: nickname
    });
    $newMessage.val('');
    return false;
  });

  // Socket Listeners 
  socket.on('new user', appendNewUser)

  socket.on('chat message', appendMessage);
  // End Socket Listeners

  
  // Helper Functions
  function appendMessage (messageObj) {
    $messageList.append($('<li>').text(messageObj.message).prepend($('<p>').text(messageObj.name)));
  }
  
  function appendNewUser (user) {
    $messageList.append($('<li>').text(user + " connected!"));
  }
});
  