import {Socket} from "phoenix"

// let socket = new Socket("/ws")
// socket.join("topic:subtopic", {}, chan => {
// })

$(function(){
  var socket = new Phoenix.Socket("ws://" + location.host + "/ws");
  var $messages = $("#messages");
  var $messageInput = $("#message-input");
  var $usernameInput = $("#username");

  socket.join("rooms", {}, function(channel){
    channel.on("user:entered", function(message){
      $messages.append("<br/>[" + message.username + "] entered");
    });

    channel.on("new:message", function(message){
      var username = message.username || "anonymous"
      $messages.append("<br/>[" + username + "] " + message.content);
      var height = $messages[0].scrollHeight;
      $messages.scrollTop(height);
    });

    $messageInput.off("keypress").on("keypress", function(e){
      console.log("pressed");
      if (e.keyCode ==13) {
        channel.send("new:message", {
          content: $messageInput.val(),
          username: $usernameInput.val(),
        });
        $messageInput.val("");
      }
    });
  });
});

let App = {
}

export default App
