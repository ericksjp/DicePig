import { getGameSession } from "../services/gameSessionService.js";
import { addPlayerToQueue, removePlayerFromQueue } from "../services/queueService.js";
import { sendMessage } from "../utils/index.js";
import manageGameSession from "./gameSocket.js";

function removeListeners(ws) {
  ws.removeAllListeners("game-found");
  ws.removeAllListeners("close");
  ws.removeAllListeners("error");
}

function enterGame(ws, gameSessionId) {
  const gameSession = getGameSession(gameSessionId);

  // if the player was added to the game, start the game session and remove the listeners
  try {
    const position = gameSession.gameInstance.addPlayer(ws);
    removeListeners(ws)
    manageGameSession(ws, position, gameSession);
    return true;
  } catch (error) {
    // resinsert the player in the queue if for some reason it was not possible to add him to the game
    addPlayerToQueue(ws);
  }
}

export default function manageQueue(ws) {
  if (
    (function () {
      const gameSessionId = addPlayerToQueue(ws);
      return gameSessionId && enterGame(ws, gameSessionId);
    })()
  ) return;

  sendMessage(ws, "queue-entered")

  ws.on("game-found", (id) => {
    enterGame(ws, id)
  })

  ws.on("close", () => {
    removePlayerFromQueue(ws);
  })

  ws.on("error", () => {
    ws.close();
    removePlayerFromQueue(ws);
  })
}
