import {Socket} from "phoenix"

// let socket = new Socket("/ws")
// socket.join("topic:subtopic", {}, chan => {
// })

$(function(){
  var socket = new Phoenix.Socket("ws://" + location.host + "/ws");
  var $messages = $("#messages");
  var $messageInput = $("#message-input");
  var $usernameInput = $("#username");
  var $rooms = $("#rooms");
  var $roomsInput = $("#rooms-input");
  var $addRoom = $("#add-room");

  $('#chat-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

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
    channel.on("new:room", function(message){
      console.log(message);
      var room = message.room;
      var link_id = "join_room_" + room
      $rooms.append('<a id="' + link_id + '" href="#">' + message.room + '</a>');
      $("#" + link_id).click(function (){
        channel.send("join:room", {
          room: room
        });
      });
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

    $addRoom.click(function(){
      channel.send("new:room", {
        room: $roomsInput.val()
      });
      $roomsInput.val("");
    });
  });
});

let App = {
}

export default App
