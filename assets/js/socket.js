// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("dashboard:index", {})

let table = null;

channel.on("events", payload => {

  $(payload.events).each(function(index, event) {
    // Was: .toLocaleFormat('%H:%M:%S')
    event.time = (new Date(event.time * 1000)).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
    if (parseFloat(event.metric)) {
      event.metric = parseFloat(event.metric.toFixed(6))
    }
  })

  if (table === null) {
    table = $('table').DataTable({
      data: payload.events,
      columns: [
        {data: 'host'},
        {data: 'service'},
        {data: 'state'},
        {data: 'time'},
        {data: 'description'},
        {data: 'tags'},
        {data: 'metric'},
        {data: 'ttl'},
      ],
      columnDefs: [
	{
	  render: function(data, type, row) {
	    if (data === null || row.state === null) {
	      return data
	    } else if (row.state == 'failure' || row.state == 'critical') {
	      return '<b style="color: #d9534f">' + data + '</b>';
	    } else {
	      return data;
	    }
	  },
	  targets: [0, 1, 3, 4, 5, 6, 7],
	},
	{
	  render: function(data, type, row) {
	    if (data === null) {
	      return data
	    } else if (data == 'success' || data == 'ok') {
	      return '<span class="label label-success">' + data + '</span>';
	    } else if (data == 'failure' || data == 'critical') {
	      return '<span class="label label-danger">' + data + '</span>';
	    } else if (data == 'warning') {
	      return '<span class="label label-warning">' + data + '</span>';
	    } else {
	      return data;
	    }
	  },
	  targets: 2,
	}
      ],
      paging: false
    });

  } else {
    table.clear();
    table.rows.add(payload.events);
    table.draw();
  }
})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
