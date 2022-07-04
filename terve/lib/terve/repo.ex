defmodule Terve.Repo do
  use Ecto.Repo,
    otp_app: :terve,
    adapter: Ecto.Adapters.Postgres
end
