// TODO implement socket functionality
import { WebSocketServer } from "ws";

const gameSocket = new WebSocketServer({ clientTracking: false, noServer: true });

gameSocket.on("connection", (ws, position, gameSession) => {
  ws.send(JSON.stringify({position, gameSession}));
});

export default gameSocket;
