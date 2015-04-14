defmodule RoomServerTest do
  use ExUnit.Case
  alias Chatty.RoomServer
  import RoomServer

  test "Can add a new room" do
    add_room "my_room"

    assert Enum.member? rooms, "my_room"
  end

  test "Can join a socket to a room" do
    socket = %{socket: 1234}
    add_room "my_room"
    join_room socket, "my_room"

    sockets_in_room = room_members "my_room"
    assert Enum.member? sockets_in_room, socket
  end

  test "Can retrieve list of rooms a socket has joined" do
    socket_1 = %{socket: 1}
    socket_2 = %{socket: 2}

    add_room "Room 1"
    add_room "Room 2"
    add_room "Room 3"

    join_room socket_1, "Room 1"
    join_room socket_1, "Room 2"
    join_room socket_2, "Room 2"
    join_room socket_2, "Room 3"

    assert rooms(socket_1), ["Room 1", "Room 2"]
  end
end
