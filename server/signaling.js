import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    console.log("Received message:", message);
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) { 
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log('Signaling server started on ws://localhost:8080');
