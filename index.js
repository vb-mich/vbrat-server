const port = process.env.PORT || 8080

const WebSocketServer = require('ws').Server
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer()
const requestIp = require('request-ip');
const wss = new WebSocketServer({ server })

const rooms = {}

wss.on('connection', function(ws, req)
{
  const roomName = req.url

  // Create room
  if (!rooms[roomName]) {
    console.log(roomName, 'create')
    rooms[roomName] = []
  }
  rooms[roomName].push({ ws })
  console.log('New sub ', requestIp.getClientIp(req), 'in ', roomName, '(', rooms[roomName].length, 'subs)')
  ws.send(';ip=' + requestIp.getClientIp(req))

  ws.on('message', function(data) {
    if(data!="~p") //this is a "ping message" to keep the socket alive on heroku, RFC ping/pong won't prevent heroku to kill the connection
    {
       rooms[roomName].forEach
       (
          node => {
      	      if (node.ws !== ws)
	        node.ws.send(data)
    	  }
       )
    }
  })

  ws.on('close', function() {
    console.log('closing')
    console.log(roomName, rooms[roomName].length, 'subs')
    rooms[roomName] = rooms[roomName].filter(node => node.ws !== ws)
    // cleanup room
    if (!rooms[roomName].length) {
      console.log(roomName, 'delete')
      delete rooms[roomName]
    }
  })

  ws.on('error', function(err) {
    console.log(roomName, 'error', err.message)
    ws.close()
  })
})

// HTTP

function serve(filename) {
  return (req, res) => {
    res.sendFile(path.join(__dirname + '/public' + (filename || req.path)))
  }
}

app.get('/connectable.js', serve())
app.get('/', serve('/index.html'))
//app.get('/:foo', serve('/index.html'))

server.on('request', app)
server.listen(port, function() {
  console.log('Listening on port:' + port)
})
