defmodule Dashboard.Index do
  use Task

  def start_link do
    Task.start_link(__MODULE__, :run, [])
  end

  def run do

    {:ok, events} = Riemann.query('true')

    DashboardWeb.Endpoint.broadcast! "dashboard:index", "events", %{events: events}

    Process.sleep 2_000

    run()
  end
end
