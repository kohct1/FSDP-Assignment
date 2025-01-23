import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';
import {v4 as uuidv4} from 'uuid';

const server = http.createServer();
const port = 8080;
const wsServer = new WebSocketServer({ server });

//const clients = new Set();
const connections = {};
const users = {};

//Need to update code to support message data
function broadcastAll() {
  Object.keys(connections).forEach(uuid =>{
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  })
}

//When receiving a message
function handleMessage(rawMessage, uuid) {
  const message = JSON.parse(rawMessage.toString());
  console.log(message);
  let currentUser = users[uuid];
  currentUser.state = message.state;
  currentUser.message = message.message;
  broadcastAll();
  console.log(`${currentUser.username} has updated their state or message`);
  
}

function handleClose(uuid) {
  console.log(`User ${users[uuid].username} has disconnected`);
  delete connections[uuid];
  delete users[uuid];

  broadcastAll();
}

//Socket connection string: ws://localhost:8080?username=
wsServer.on('connection', (connection, request) => {

  //clients.add(connection);
  const {username} = url.parse(request.url, true).query;
  const uuid = uuidv4(); 
  console.log("User Credentials: " + uuid + " " + username);
  //Sets each connection to its uuid
  connections[uuid] = connection;
  
  users[uuid] = {
    username: username,
    //Send messages in state
    message: {

    },
    state: {
      typing: "Not typing",
      status: "Offline",
      ping: "False",
      onEnquiry: "False",
      role: "Unknown"
    },
  }
  broadcastAll();
  connection.on('message', message => handleMessage(message, uuid));
  connection.on('close', () => handleClose(uuid));
  /*
  connection.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log("Received message:", parsedMessage);
    // Forward the message to all clients except the sender
    clients.forEach(client => {
      if (client !== connection && client.readyState === connection.OPEN) {
        client.send(message);  // Send message to all clients
      }
    });
  });
  */
});

server.listen(port, () => {
  console.log(`Websocket server started on ws://localhost:${port}`);
})

