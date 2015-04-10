defmodule RoomServerTest do
  use ExUnit.Case
  alias Chatty.RoomServer

  test "Can add a new room" do
    RoomServer.add_room "my_room"

    assert Enum.member? RoomServer.rooms, "my_room"
  end

  test "Can join a socket to a room" do
    socket = %{socket: 1234}
    RoomServer.add_room "my_room"
    RoomServer.join_room socket, "my_room"

    sockets_in_room = RoomServer.room_members "my_room"
    assert Enum.member? sockets_in_room, socket
  end
end
