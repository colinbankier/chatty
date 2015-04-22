defmodule Chatty.ChatChannel do
  use Phoenix.Channel
  require Logger

  def join(topic, message, socket) do
    Logger.debug "JOIN: #{socket.channel}:#{topic}:#{inspect message}"
    send(self, {:after_join, message})
    {:ok, socket}
  end

  def handle_info({:after_join, message}, socket) do
    broadcast! socket, "user:entered", %{
      username: message["username"] || "anonymous"
    }
    {:noreply, socket}
  end
end

