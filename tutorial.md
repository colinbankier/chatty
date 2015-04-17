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

# Get Phoenix
From any directory, install the phoenix archive. We'll choose the latest version 0.11.0.
```
mix archive.install https://github.com/phoenixframework/phoenix/releases/download/v0.11.0/phoenix_new-0.11.0.ez
```
This installs a mix archive that gives us a `phoenix.new` command that can be used from any directory.

# Create a new app
Use our newly install archive to create a fresh app. The arg is a directory that can an absolute or relative path.
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

# Adding a controller, view and template
(http://www.phoenixframework.org/v0.11.0/docs/adding-pages)


