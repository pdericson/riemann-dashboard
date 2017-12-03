defmodule DashboardWeb.PageControllerTest do
  use DashboardWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "<table "
  end
end
