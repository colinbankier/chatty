defmodule Chatty.RoomController do
  use Chatty.Web, :controller
  alias Chatty.RoomServer

  plug :action

  def index(conn, _params) do
    json conn, %{rooms: RoomServer.rooms}
  end
end
