defmodule Chatty.PageController do
  use Chatty.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end
end
