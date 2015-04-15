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

  function add_room(channel, room) {
      var link_id = "join-room-" + room;
      if($("#" + link_id).length == 0) {
        $rooms.append('<li><a id="' + link_id + '" href="#">' + room + '</a></li>');
        $("#" + link_id).click(function (){
          join_room(channel, room);
        });
      }
  }

  function join_room(channel, room) {
      console.log("joined " + room);
      add_room_tab(room);
      channel.send("join:room", {
        username: $usernameInput.val(),
        room: room
      });
  }

  function display_message(message, content) {
    var username = message.username || "anonymous";
    var room = message.room || "lobby";
    var room_tab = $("#chat-tab-" + room);
    room_tab.append("<br/>[" + username + "] " + content);
    var height = room_tab[0].scrollHeight;
    room_tab.scrollTop(height);
  }

  function set_current_room(room) {
    var room_tab = "chat-tab-" + room;
    $current_room = room;
    console.log($('#chat-tabs a[href="#' + room_tab + '"]'));
    $('#chat-tabs a[href="#' + room_tab + '"]').tab('show');
  }

  function add_room_tab(room) {
    var room_tab = "chat-tab-" + room;
    if($("#" + room_tab).length == 0) {
      $('<li role="presentation" class=""><a href="#' + room_tab + '" aria-controls="' + room_tab + '" role="tab" data-toggle="tab">' + room + '</a></li>').appendTo("#tablist");
      $('<div role="tabpanel" class="tab-pane" id="' + room_tab + '"></div>').appendTo("#tab-content");
      $('#chat-tabs a[href="#' + room_tab + '"]').click(function (e) {
        e.preventDefault();
        set_current_room(room);
      });
      set_current_room(room);
    }
  }

  socket.join("rooms", {}, function(channel){
    join_room(channel, "lobby");
    channel.on("new:room", function(message){
      add_room(channel, message.room);
    });
    channel.on("user:entered", function(message){
      console.log("User entered");
      console.log(message);
      display_message(message, "entered");
    });

    channel.on("new:message", function(message){
      console.log("Got message:");
      console.log(message);
      display_message(message, message.content);
    });

    channel.on("init:rooms", function(message){
      console.log("Got rooms:");
      console.log(message);
      message.rooms.forEach(function(room) {
        add_room(channel, room);
      });
    });

    $messageInput.off("keypress").on("keypress", function(e){
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
      var room = $roomsInput.val().replace(/[^\w-]/gi, '');
      channel.send("new:room", {
        room: room
      });
      join_room(channel, room);
      $roomsInput.val("");
    });
  });
});

let App = {
}

export default App
