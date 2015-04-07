use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :chatty, Chatty.Endpoint,
  secret_key_base: "IHoGFT0KIAUYfDO3TCEhWb+AA5rS0JajcJ0tMENRN8S++Y/VEwaCFTjrPgYMFiir"

# Configure your database
config :chatty, Chatty.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "chatty_prod"
