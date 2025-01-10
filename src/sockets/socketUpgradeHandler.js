import { WebSocketServer } from "ws";
import { getGameSession } from "../services/gameSessionService.js";
import { closeSocketWithErrorResponse, parseSocketQueryParams } from "../utils/index.js";
import manageGameSession from "./gameSocket.js";
import manageQueue  from "./queueSocket.js";

const wss = new WebSocketServer({ noServer: true, clientTracking: false });

function handleGameUpgrade(request, socket, head) {
  const { id } = parseSocketQueryParams(request);
  if (!id) return closeSocketWithErrorResponse(socket, 400, "Game ID is required");

  const gameSession = getGameSession(id);
  if (!gameSession) return closeSocketWithErrorResponse(socket, 404, "Game not found");
  if (gameSession.gameInstance.status !== "waiting")
    return closeSocketWithErrorResponse( socket, 403, "Game has already started");

  wss.handleUpgrade(request, socket, head, (ws) => {
    const position = gameSession.gameInstance.addPlayer(ws);
    manageGameSession(ws, position, gameSession);
  })
}

function handleQueueUpgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    manageQueue(ws);
  });
}

export default function (server) {
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, "wss://base.url");

    // this will allow to handle different paths in the future
    switch (pathname) {
      case "/game":
        handleGameUpgrade(request, socket, head);
        break;
      case "/queue":
        handleQueueUpgrade(request, socket, head);
        break;
      default:
        closeSocketWithErrorResponse(socket, 404, "Not Found");
        break;
    }
  });
}
