import {Socket} from "phoenix"

$(function(){
  var socket = new Phoenix.Socket("/ws");
  var $messages = $("#messages");
  var $messageInput = $("#message-input");
  var $usernameInput = $("#username");

  socket.connect();
  socket.join("chat", {})
    .receive("ok", function(channel){

    channel.on("new:message", function(message){
      var username = message.username || "anonymous"
      $messages.append("<br/>[" + username + "] " + message.content);
    });

    $messageInput.off("keypress").on("keypress", function(e){
      if (e.keyCode ==13) {
        channel.push("new:message", {
          content: $messageInput.val(),
          username: $usernameInput.val(),
        });
        $messageInput.val("");
      }
    });

    channel.on("user:entered", function(message){
      $messages.append("<br/>[" + message.username + "] entered");
    });
  });
});

let App = {
}

export default App
