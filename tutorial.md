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
defmodule Chatty.ChatView do
  use Chatty.Web, :view
end
```
We also need a template, create `web/templates/chat/index.html.eex`. Lets just put anything in there for now to see it working, we'll fill in some real content soon.
```
<p>One day, I want to be a Chat Application.</p>
```
Check out the page in browser again, you'll see your content, you've successfully created your controller, view and template!

You may have noticed something cool - if you edit your template, you don't even have to refresh your browser to see the change. Whoa. Magic.
Let's add some real HTML for our Chat App.

# Chat App layout and template
Templates are rendered in a layout. We'll create a new layout for the chat window of our app.
Create our new layout `web/templates/layouts/chat.html.eex`
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Chatty</title>
    <link rel="stylesheet" href="<%= static_path(@conn, "/css/app.css") %>">
  </head>

  <body>
    <!-- Fixed navbar -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Phoenix Chat</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav pull-right">
            <li><a href="http://github.com/phoenixframework/phoenix">Learn more about the Phoenix Framework</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

      <%= @inner %>

    <script src="<%= static_path(@conn, "/js/app.js") %>"></script>
    <script>require("web/static/js/app")</script>
  </body>
</html>
```
And some HTML for our template, replace the contents of `web/templates/chat/index.html.eex` with this:
```
<div id="messages" class="container">
</div>
<div id="footer">
  <div class="container">
    <div class="row">
      <div class="col-sm-2">
        <div class="input-group">
          <span class="input-group-addon">@</span>
          <input id="username" type="text" class="form-control" placeholder="username">
        </div><!-- /input-group -->
      </div><!-- /.col-lg-6 -->
      <div class="col-sm-10">
        <input id="message-input" class="form-control" />
      </div><!-- /.col-lg-6 -->
    </div><!-- /.row -->
  </div>
</div>
```
Our markup needs a little CSS to make things sit right. Create `web/static/css/app.scss` and stick the following in it.
```
/* Sticky footer styles
-------------------------------------------------- */
html {
  position: relative;
  min-height: 100%;
}
body {
  /* Margin bottom by footer height */
  margin-bottom: 60px;
}
body, html {
  overflow: hidden;
  height: 100%;
}
#footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  /* Set the fixed height of the footer here */
  height: 60px;
  padding-top: 1em;
  background-color: #f5f5f5;
}

#messages {
  margin-top: 80px;
}
/* Custom page CSS
-------------------------------------------------- */
/* Not required for template or sticky footer method. */

body > .container {
  padding: 60px 15px 0;
}
.container .text-muted {
  margin: 20px 0;
}

#footer > .container {
  padding-right: 15px;
  padding-left: 15px;
}

code {
  font-size: 80%;
}
```
You'll notice the default css includes the entire Twitter Bootstrap css in `app.scss`. Any files in these `web/static` directories are
precompiled automatically before being sent to the browser.

# You promised us WebSockets!
All right, now that we have the start of our UI in place, lets implement the exciting stuff, WebSockets! Add the this section to your `web/router.ex`:
```
  socket "/ws", Chatty do
    channel "chat", ChatChannel
  end
```
This routes any WebSocket messages with the topic "chat" to a module `ChatChannel`. This doesn't exist yet, let's create it. Create `web/channels/chat.ex`:
```
defmodule Chatty.ChatChannel do
  use Phoenix.Channel
  require Logger

  def join(topic, message, socket) do
    Logger.debug "JOIN: #{socket.channel}:#{topic}:#{inspect message}"
  end
end
```
There are a couple actions you can handle, `join` is one of them. For moredetails see (http://www.phoenixframework.org/v0.11.0/docs/channels).

Lets add some Javascript to join our channel. It won't do much yet, but it should print our log message.
We'll use jquery to implement updating elements on the page etc, so lets grab that.
Download () into `web/static/vendor/`.
If you're on an unix-ish OS, this should do the trick:
`curl http://code.jquery.com/jquery-1.11.2.min.js > web/static/vendor/jquery-1.11.2.min.js`
Open up `web/static/js/app.js` and enter the following:
```
$(function(){
  var socket = new Phoenix.Socket("/ws");
  socket.connect();
  socket.join("chat", {}, function(channel){
  });
});

```
This should join our socket on page load. It won't do anything great yet, but you should see our log message
in your console.

# Let's Chat
Ok, a basic socket is hooked up, let's make it chat!
First, lets add the client-side code in `app.js`. We'll use jQuery to find the relevant elements on the page, add this
under our `var socket = ...` line:
```
  var $messages = $("#messages");
  var $messageInput = $("#message-input");
  var $usernameInput = $("#username");
```
Inside the `socket.join` callback, we handle new messages and display them on the page:
```
    channel.on("new:message", function(message){
      var username = message.username || "anonymous"
      $messages.append("<br/>[" + username + "] " + message.content);
    });
```
Next we send our own message when "return" (keycode 13) is pressed in our message input:
```
    $messageInput.off("keypress").on("keypress", function(e){
      if (e.keyCode ==13) {
        channel.send("new:message", {
          content: $messageInput.val(),
          username: $usernameInput.val(),
        });
        $messageInput.val("");
      }
    });
```
It first removes the event, so that it doesn't end up with multiple if the socket disconnects and connects again.
Finally, we listen for a "new:message" topic in our channel on the server-side, and broadcast it out to all connected channels:
```
  def handle_in(topic = "new:message", message, socket) do
    broadcast! socket, topic, message
    {:reply, :ok, socket}
  end
```
Try it out! You should be able to chat between multiple browser tabs.

## Broadcast on connected
Lets send out a message to all connected sockets when someone connects. Update your `join` function to the following
and add a `handle_info` function:
```
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
```
The extra `send` and `handle_info` are used becuase `push` and `broadcast` can only be called after the socket has finished joining.
These are GenServer functions, for further info on these, see (http://elixir-lang.org/docs/master/elixir/GenServer.html).

Next we'll add some javascript to handle the event, and use jQuery to display a message on the page:
In `app.js` update your existing code to include:
```
  channel.on("user:entered", function(message){
    $messages.append("<br/>[" + message.username + "] entered");
  });
```
Every time you open a new browser window, you should see a new "user conntect" message.






