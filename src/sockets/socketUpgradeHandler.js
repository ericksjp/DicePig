import gameSocket from "./gameSocket.js";
import { getGameSession } from "../services/gameSessionService.js";

function parseSocketQueryParams(request) {
  const url = new URL(request.url, `ws://${request.headers.host}`);
  const queryParams = {};
  for (const [key, value] of url.searchParams.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}

function closeSocketWithErrorResponse(socket, code, message) {
  socket.write(`HTTP/1.1 ${code} ${message}\r\n\r\n`);
  socket.destroy();
}

function handleGameUpgrade(request, socket, head) {
  const { id } = parseSocketQueryParams(request);
  if (!id) return closeSocketWithErrorResponse(socket, 400, "Game ID is required");

  const gameSession = getGameSession(id);
  if (!gameSession) return closeSocketWithErrorResponse(socket, 404, "Game not found");

  try {
    // passing 0 as a placeholder
    const position = gameSession.game.addPlayer(0);
    gameSocket.handleUpgrade(request, socket, head, (ws) => {
      gameSocket.emit("connection", ws, position, gameSession);
    });
  } catch (error) {
    return closeSocketWithErrorResponse(socket, 403, error.message);
  }
}

export default function (server) {
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, "wss://base.url");

    switch (pathname) {
      case "/game":
        handleGameUpgrade(request, socket, head);
        break;
      default:
        closeSocketWithErrorResponse(socket, 404, "Not Found");
        break;
    }
  });
}
