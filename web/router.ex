defmodule Chatty.Router do
  use Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Chatty do
    pipe_through :browser # Use the default browser stack

    get "/", ChatController, :index
  end

  socket "/ws", Chatty do
    channel "chat", ChatChannel
  end

  # Other scopes may use custom stacks.
  # scope "/api", Chatty do
  #   pipe_through :api
  # end
end
