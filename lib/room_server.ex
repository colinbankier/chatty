defmodule Chatty.RoomServer do
  require Logger
  import Agent

  @agent __MODULE__

  def start_link do
    initial_state = %{"lobby" => HashSet.new}
    start_link fn -> initial_state end, name: @agent
  end

  def add_room room do
    Logger.info "New room #{room}"
    update @agent, fn rooms ->
      Dict.put_new(rooms, room, HashSet.new)
    end
  end

  def rooms do
    get @agent, fn rooms ->
      Dict.keys(rooms)
    end
  end

  def rooms member do
    filter = fn {_, members} -> Enum.member? members, member end
    map = fn {room, _} -> room end
    get @agent, fn rooms ->
      Enum.filter_map rooms, filter, map
    end
  end

  def join_room socket, room do
    if member?(room, socket) do
      :already_joined
    else
      update @agent, fn rooms ->
        Dict.update rooms, room, HashSet.new, fn members ->
          Set.put(members, socket)
        end
      end
      :ok
    end
  end

  def room_members room do
    get @agent, fn rooms ->
      Dict.get(rooms, room) |> Set.to_list
    end
  end

  def member?(room, member) do
    get @agent, fn rooms ->
      Dict.get(rooms, room) |> Set.member?(member)
    end
  end
end
