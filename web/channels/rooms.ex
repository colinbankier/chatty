defmodule Chatty.Channels.Rooms do
  use Phoenix.Channel
  alias Chatty.RoomServer
  require Logger

  def join(topic, message, socket) do
    Logger.debug "JOIN: #{socket.channel}:#{topic}:#{inspect message}"
    reply socket, "init:rooms", %{rooms: RoomServer.rooms}
    {:ok, socket}
  end

  def handle_in(topic = "new:message", message, socket) do
    Logger.debug "Handle #{topic}"
    reply_to_room_members message["room"], topic, message
    {:ok, socket}
  end

  def handle_in(topic = "new:room", message, socket) do
    RoomServer.add_room message["room"]
    broadcast! socket, topic, message
    {:ok, socket}
  end

  def handle_in("join:room", message, socket) do
    if RoomServer.join_room(socket, message["room"]) == :ok do
      reply_to_room_members message["room"], "user:entered", %{
        username: message["username"] || "anon",
        room: message["room"]
      }
    end
    {:ok, socket}
  end

  def reply_to_room_members room, topic, message do
    Enum.each RoomServer.room_members(room), fn member ->
      reply member, topic, message
    end
  end
end
