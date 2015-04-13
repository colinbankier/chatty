import {Socket} from "phoenix"

// let socket = new Socket("/ws")
// socket.join("topic:subtopic", {}, chan => {
// })

$(function(){
  var socket = new Phoenix.Socket("ws://" + location.host + "/ws");
  var $messages = $("#lobby");
  var $messageInput = $("#message-input");
  var $usernameInput = $("#username");
  var $rooms = $("#rooms");
  var $roomsInput = $("#rooms-input");
  var $addRoom = $("#add-room");
  var $current_room = "lobby";
  $('#chat-tabs a[href="#chat-tab-lobby"]').click(function (e) {
    e.preventDefault();
    $current_room = "lobby";
    $(this).tab('show');
  });

  socket.join("rooms", {}, function(channel){
    channel.on("user:entered", function(message){
      $messages.append("<br/>[" + message.username + "] entered");
    });

    channel.on("new:message", function(message){
      var username = message.username || "anonymous";
      var room = message.room || "lobby";
      console.log("Got message:");
      console.log(message);
      var room_tab = $("#chat-tab-" + room);
      room_tab.append("<br/>[" + username + "] " + message.content);
      var height = room_tab[0].scrollHeight;
      room_tab.scrollTop(height);
    });
    channel.on("new:room", function(message){
      console.log(message);
      var room = message.room;
      var link_id = "join-room-" + room;
      var room_tab = "chat-tab-" + room;
      $rooms.append('<a id="' + link_id + '" href="#">' + message.room + '</a>');
      $("#" + link_id).click(function (){
        channel.send("join:room", {
          room: room
        });
        $('<li role="presentation" class=""><a href="#' + room_tab + '" aria-controls="' + room_tab + '" role="tab" data-toggle="tab">' + room + '</a></li>').appendTo("#tablist");
        $('<div role="tabpanel" class="tab-pane" id="' + room_tab + '">' + room + '</div>').appendTo("#tab-content");
        $('#chat-tabs a[href="#' + room_tab + '"]').click(function (e) {
          e.preventDefault();
          $current_room = room;
          $(this).tab('show');
        });
      });
    });

    $messageInput.off("keypress").on("keypress", function(e){
      console.log("pressed");
      if (e.keyCode ==13) {
        channel.send("new:message", {
          content: $messageInput.val(),
          username: $usernameInput.val(),
          room: $current_room,
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
