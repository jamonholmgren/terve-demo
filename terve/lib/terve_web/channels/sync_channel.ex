defmodule TerveWeb.SyncChannel do
  use Phoenix.Channel

  # syncing MST states
  def join("tervesync:" <> key_and_storename, _message, socket) do
    provided_key = key_and_storename.split(":").first
    storename = key_and_storename.split(":").rest.join(":")

    key = System.get_env("BASIC_SECRET_KEY") || raise("expected the BASIC_SECRET_KEY environment variable to be set")

    if provided_key != key
      {:error, %{reason: "unauthorized"}}
    else
      {:ok, socket}
    end
  end

  # def join("room:" <> _private_room_id, _params, _socket) do
  #   {:error, %{reason: "unauthorized"}}
  # end

  def handle_in("message", payload, socket) do
    broadcast!(socket, "message", payload)
    {:noreply, socket}
  end
end
