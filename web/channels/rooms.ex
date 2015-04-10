defmodule Chatty.Channels.Rooms do
  use Phoenix.Channel
  require Logger

  def join(topic, message, socket) do
    Logger.debug "JOIN: #{socket.channel}:#{topic}:#{inspect message}"
    broadcast socket, "user:entered", %{username: message["username"] || "anon"}
    {:ok, socket}
  end

  def handle_in(topic = "new:message", message, socket) do
    Logger.debug "Handle #{topic}"
    broadcast! socket, topic, message
    {:ok, socket}
  end

  def handle_in("new:room", message, socket) do
    RoomsServer.add_room message["room"]
    {:ok, socket}
  end

  def handle_in("join:room", message, socket) do
    RoomsServer.join_room message["room"], socket
    {:ok, socket}
  end
end
