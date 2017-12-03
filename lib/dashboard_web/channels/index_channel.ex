defmodule DashboardWeb.IndexChannel do
  use Phoenix.Channel

  def join("dashboard:index", _message, socket) do
    {:ok, socket}
  end
end
