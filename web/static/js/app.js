import {Socket} from "phoenix"

$(function(){
  var socket = new Phoenix.Socket("/ws");
  socket.connect();
  socket.join("chat", {}, function(channel){
  });
});

let App = {
}

export default App
