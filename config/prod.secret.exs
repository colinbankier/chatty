use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :chatty, Chatty.Endpoint,
  secret_key_base: "0Kbq9jji4UKGSTwp0TR+uCxWgdYaMRXqlOhftsPF1HtbV3h661E1mHGMtsEiCKhS"

# Configure your database
config :chatty, Chatty.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "chatty_prod"
