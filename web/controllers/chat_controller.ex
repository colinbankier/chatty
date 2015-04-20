defmodule Chatty.ChatController do
  use Chatty.Web, :controller

  plug :action

  def index(conn, _params) do
    conn
    |> put_layout("chat.html")
    |> render("index.html")
  end
end
