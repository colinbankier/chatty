defmodule RoomServerTest do
  use ExUnit.Case
  alias Chatty.RoomServer

  test "Can add a new room" do
    RoomServer.add_room "my_room"

    assert Enum.member? RoomServer.rooms, "my_room"
  end
end
