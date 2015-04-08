defmodule Chatty.Channels.Rooms do
  use Phoenix.Channel

  def join(topic, message, socket) do
    IO.puts "JOIN: #{socket.channel}:#{topic}:#{inspect message}"
    broadcast socket, "user:entered", %{username: message["username"] || "anon"}
    {:ok, socket}
  end
end
