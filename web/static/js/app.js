import {Socket} from "phoenix"

$(function(){
  var socket = new Phoenix.Socket("/ws");
  var $messages = $("#messages");

  socket.connect();
  socket.join("chat", {})
    .receive("ok", function(channel){
    channel.on("user:entered", function(message){
      $messages.append("<br/>[" + message.username + "] entered");
    });
  });
});

let App = {
}

export default App
