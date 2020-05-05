vbrat-server
---

Based on https://github.com/thgh/websocket-room as alternative to websocket.in
Hosted live on Heroku.
This websocket server will broadcast all messages it receives to sockets connected to the same URL.

```
// Connect to `room-name`
const socket = connectable('wss://serveraddr:port/room-name')

// Log all messages in `room-name`
socket.subscribe(console.log)

// Send a chat message
form.onsubmit = () => socket.send(nameInput.value)
```
