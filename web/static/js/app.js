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
  var $channel;

  function add_room(room) {
      var link_id = "join-room-" + room;
      $rooms.append('<a id="' + link_id + '" href="#">' + room + '</a>');
      $("#" + link_id).click(function (){
        join_room(room);
      });
  }

  function join_room(room) {
      console.log("joined " + room);
      var room_tab = add_room_tab(room);
      console.log(room_tab);
      $channel.on("user:entered:" + room, function(message){
      console.log(room_tab);
        room_tab.append("<br/>[" + message.username + "] entered");
      });
      $channel.on("new:message", function(message){
        console.log("new message " + room);
      });

      $channel.on("new:message:" + room, function(message){
        var username = message.username || "anonymous";
        console.log("Got message:");
        console.log(message);
        room_tab.append("<br/>[" + username + "] " + message.content);
        var height = room_tab[0].scrollHeight;
        room_tab.scrollTop(height);
      });
  }

  function add_room_tab(room) {
    var room_tab = "chat-tab-" + room;
    $('<li role="presentation" class=""><a href="#' + room_tab + '" aria-controls="' + room_tab + '" role="tab" data-toggle="tab">' + room + '</a></li>').appendTo("#tablist");
    $('<div role="tabpanel" class="tab-pane" id="' + room_tab + '">' + room + '</div>').appendTo("#tab-content");
    $('#chat-tabs a[href="#' + room_tab + '"]').click(function (e) {
      e.preventDefault();
      $current_room = room;
      $(this).tab('show');
    });
    $('#chat-tabs a[href="#' + room_tab + '"]').click(function (e) {
      e.preventDefault();
      $current_room = room;
      $(this).tab('show');
    });
    return $("#" + room_tab);
  }

  $.ajax({
    url: location.protocol + "//" + location.host + "/api/rooms",
    success: function(response){
      response.rooms.forEach(function(room) {
        add_room(room);
      });
    },
    dataType: "json"
  });

  socket.join("rooms", {}, function(channel){
    $channel = channel;
    channel.on("new:room", function(message){
      add_room(message.room);
    });
    // channel.on("new:message", function(message){
    //   console.log("new message rooms");
    // });
    // channel.on("new:message:bees", function(message){
    //   console.log("new message rooms bees");
    // });

    $messageInput.off("keypress").on("keypress", function(e){
      if (e.keyCode ==13) {
        channel.send("new:message:" + $current_room, {
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
