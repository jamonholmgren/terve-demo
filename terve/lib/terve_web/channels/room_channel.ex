defmodule TerveWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("room:game", _message, socket) do
    {:ok, socket}
  end

  # syncing MST states
  def join("room:sync:" <> _store_name, _message, socket) do
    key = System.get_env("BASIC_SECRET_KEY") || raise("expected the BASIC_SECRET_KEY environment variable to be set")

    IO.puts(socket)

    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("message", payload, socket) do
    broadcast!(socket, "message", payload)
    {:noreply, socket}
  end
end
