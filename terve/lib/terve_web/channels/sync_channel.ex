defmodule TerveWeb.SyncChannel do
  use Phoenix.Channel

  # syncing MST states
  def join("tervesync:" <> key_and_storename, _message, socket) do
    [key, _storename] = key_and_storename
      |> String.split(":", parts: 2)

    secret_key = System.get_env("BASIC_SECRET_KEY") || raise("expected the BASIC_SECRET_KEY environment variable to be set")

    if secret_key != key do
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
