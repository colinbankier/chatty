defmodule Chatty.Channels.Rooms do
  use Phoenix.Channel

  def join(topic, message, socket) do
    IO.puts "JOIN: #{socket.channel}:#{topic}:#{message}"
    {:ok, socket}
  end
end
