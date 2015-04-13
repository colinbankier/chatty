defmodule Chatty.Channels.Rooms do
  use Phoenix.Channel
  alias Chatty.RoomServer
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

  def handle_in(topic = "new:room", message, socket) do
    RoomServer.add_room message["room"]
    broadcast! socket, topic, message
    {:ok, socket}
  end

  def handle_in("join:room", message, socket) do
    RoomServer.join_room socket, message["room"]
    {:ok, socket}
  end
end
