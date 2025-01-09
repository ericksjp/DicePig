import { WebSocketServer } from "ws";
import manageGameSession from "./gameSocket.js";
import { getGameSession } from "../services/gameSessionService.js";
import { closeSocketWithErrorResponse, parseSocketQueryParams } from "../utils/index.js";

const wss = new WebSocketServer({ noServer: true, clientTracking: false });

function handleGameUpgrade(request, socket, head) {
  const { id } = parseSocketQueryParams(request);
  if (!id) return closeSocketWithErrorResponse(socket, 400, "Game ID is required");

  const gameSession = getGameSession(id);
  if (!gameSession) return closeSocketWithErrorResponse(socket, 404, "Game not found");

  // if an error occurs while adding the placeholder, close the socket with an error response
  // otherwise, upgrade the connection and pass it to the game session manager
  try {
    const position = gameSession.gameInstance.addPlayer(0);
    wss.handleUpgrade(request, socket, head, (ws) => {
      manageGameSession(ws, position, gameSession);
    });
  } catch (error) {
    console.error(error);
    return closeSocketWithErrorResponse(socket, 403, error.message);
  }
}

export default function (server) {
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, "wss://base.url");

    // this will allow to handle different paths in the future
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
