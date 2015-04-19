# Build a real-time chat app with Phoenix
In this tutorial, we're going to walk through building a simple chat application using WebSockets in the Phoenix web framework.
# Getting Setup
This part of the guide is mostly extracted from (http://www.phoenixframework.org/v0.11.0/docs/up-and-running). You follow up there later if you like, but everything you need for now should be below.
## Get Elixir
First steps, make sure Elixir is installed, see the installation guide: (http://elixir-lang.org/install.html)
Phoenix requires at least 1.0.4. Just ensure you have the latest.
## Git
It is also assumed you have git installed, if not, do whatever you do for your platform to get it.
## NPM
Javascript packages are managed by npm, you'll need to nodejs too: (https://nodejs.org/)

## Get Phoenix
From any directory, install the phoenix archive. We'll choose the latest version 0.11.0.
```
mix archive.install https://github.com/phoenixframework/phoenix/releases/download/v0.11.0/phoenix_new-0.11.0.ez
```
This installs a mix archive that gives us a `phoenix.new` command that can be used from any directory.

# Create a new app
Use our newly installed archive to create a fresh app. The arg is a directory that can an absolute or relative path.
The below command assumes you're in a top level directory that you'd like to create your project in.
```
mix phoenix.new chatty
cd chatty
```
# Lets run it
`mix phoenix.server`
then in a browser go to (http://localhost:4000)
Cool. It's given us a default page and stuff.
To kill it, do `Ctrl-c` twice. Yep, twice.

# Lets look around
Lets see what `phoenix.new` actually created for us. Here's the default structure of a phoenix app:
```
├── _build
├── config
├── deps
├── lib
├── priv
├── test
├── web
```
Most of the interesting stuff is in the `web` directory, which looks like this:
```
├── channels
├── controllers
│   └── page_controller.ex
├── models
├── router.ex
├── templates
│   ├── layout
│   │   └── application.html.eex
│   └── page
│       └── index.html.eex
└── views
|   ├── error_view.ex
|   ├── layout_view.ex
|   └── page_view.ex
└── web.ex
```
To get an idea of what's in there, open up a few files in there and have a poke around. Those familiar with Rails should feel a string similarity to what Rails would give you. Here's the general gist:
 - The Router: parses incoming requests and dispatches to the correct controller/action
 - Controllers: provide functions, called actions, to handle requests
 - Views: render templates define helper functions
 - Templates: Embedded Elixir templates, Precompiled & fast

Lets create our own to really get the idea.

# Adding our own controller, view and template
More detail here, if you want to dig further: (http://www.phoenixframework.org/v0.11.0/docs/adding-pages)

In `web/router.ex` let's change so that the line that said
```
    get "/", PageController, :index
```
to be
```
    get "/", ChatController, :index
```
Let's see what happens if we try start the app and load it in our browser:
`undefined function: Chatty.ChatController.init/1 (module Chatty.ChatController is not available)`
You'll see that Phoenix gives us a pretty nice error page that shows exactly where the error occurred, as well as en error message in the console.
Elixir in general places a strong emphasis on clear and useful error messages.

Ok, obviously we need go create `ChatController`, let's do that.
Create `web/controllers/chat_controller.ex` with the following content:
```
defmodule Chatty.ChatController do
  use Chatty.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end
end
```
If you want understand a bit more about Phoenix controllers, you can follow up here (http://www.phoenixframework.org/v0.11.0/docs/controllers).

Let's try run it again:
`undefined function: Chatty.ChatView.render/2 (module Chatty.ChatView is not available)`
Ok, it's telling us that it expects a module `Chatty.ChatView`. That's pretty reasonable, if you remember views are called by controllers to render out templates.
Create `web/views/chat_view.ex`
```
defmodule HelloPhoenix.HelloView do
  use HelloPhoenix.Web, :view
end
```
We also need a template, create `web/templates/chat/index.html.eex`. Lets just put anything in there for now to see it working, we'll fill in some real content soon.
```
<p>One day, I want to be a Chat Application.</p>
```

