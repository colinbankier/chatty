defmodule Chatty.RoomServer do
  use GenServer

  def add_room room do
    GenServer.cast(:room_server, {:add_room, room})
  end

  def rooms do
    GenServer.call(:room_server, {:rooms})
  end

  def start_link do
    GenServer.start_link(__MODULE__, nil, name: :room_server)
  end

  def init(_) do
    {:ok, []}
  end

  def handle_cast({:add_room, room}, rooms) do
    {:noreply, [ room | rooms ]}
  end

  def handle_call({:rooms}, _, rooms) do
    {:reply, rooms, rooms}
  end
end
