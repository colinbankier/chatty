defmodule Chatty.Channels.Rooms do
  use Phoenix.Channel

  def join(socket, topic, message) do
    {:ok, socket}
  end
end
