defmodule TerveWeb.PageController do
  use TerveWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
