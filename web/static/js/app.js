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

  function add_room(channel, room) {
      var link_id = "join-room-" + room;
      if($("#" + link_id).length == 0) {
        $rooms.append('<a id="' + link_id + '" href="#">' + room + '</a>');
        $("#" + link_id).click(function (){
          join_room(channel, room);
        });
      }
  }

  function join_room(channel, room) {
      console.log("joined " + room);
      add_room_tab(room);
      channel.send("join:room", {
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

  function add_room_tab(room) {
    var room_tab = "chat-tab-" + room;
    if($("#" + room_tab).length == 0) {
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
    }
  }

  function get_rooms(channel) {
    $.ajax({
      url: location.protocol + "//" + location.host + "/api/rooms",
      success: function(response){
        response.rooms.forEach(function(room) {
          add_room(channel, room);
        });
      },
      dataType: "json"
    });
  }

  socket.join("rooms", {}, function(channel){
    $channel = channel;
    get_rooms(channel);
    channel.on("new:room", function(message){
      add_room(message.room);
    });
    $channel.on("user:entered", function(message){
      console.log(message);
      display_message(message, "entered");
    });

    $channel.on("new:message", function(message){
      console.log("Got message:");
      console.log(message);
      display_message(message, message.content);
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
