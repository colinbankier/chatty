defmodule Chatty.RoomServer do
  use GenServer
  require Logger

  def add_room room do
    GenServer.cast(:room_server, {:add_room, room})
  end

  def rooms do
    GenServer.call(:room_server, {:rooms})
  end

  def rooms member do
    GenServer.call(:room_server, {:rooms, member})
  end

  def join_room socket, room do
    GenServer.cast(:room_server, {:join_room, socket, room})
  end

  def room_members room do
    GenServer.call(:room_server, {:room_members, room})
  end

  def start_link do
    GenServer.start_link(__MODULE__, nil, name: :room_server)
  end

  def init(_) do
    {:ok, %{"lobby" => HashSet.new}}
  end

  def handle_cast({:add_room, room}, rooms) do
    Logger.info "New room #{room}"
    {:noreply, Dict.put_new(rooms, room, HashSet.new)}
  end

  def handle_cast({:join_room, socket, room}, rooms) do
      rooms = Dict.update(rooms, room, HashSet.new, fn members ->
        Set.put(members, socket)
      end)
      Logger.info "Joined room #{room}"
      {:noreply, rooms}
  end

  def handle_call({:rooms}, _, rooms) do
    {:reply, Dict.keys(rooms), rooms}
  end

  def handle_call({:rooms, member}, _, rooms) do
      member_rooms = Enum.filter_map(rooms,
        fn {_, members} ->
          Enum.member? members, member
        end,
        fn {room, _} -> room end
      )

    {:reply, member_rooms, rooms}
  end

  def handle_call({:room_members, room}, _, rooms) do
    members = Dict.get(rooms, room) |> Set.to_list
    {:reply, members, rooms}
  end
end
