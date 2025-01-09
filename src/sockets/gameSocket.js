import { sendMessage, broadcastMessage } from "../utils/index.js";
import { updateGameSession, removeGameSession } from "../services/gameSessionService.js";
import WebSocket from "ws";
import gameActions from "../actions/gameActions.js";

function handleRematchVote(playerPosition, gameSession) {
  const { gameInstance, rematchVotes } = gameSession;
  const sockets = gameInstance.getPlayersWs();

  // only allow the vote if the game is finished and the player hasn't voted yet
  if (gameInstance.status !== "finished" || rematchVotes[playerPosition]) {
    sendMessage(sockets[playerPosition], "invalid", {
      message: "Invalid rematch: the game is not finished or you have already voted",
    });
    return;
  }

  // if the other player was voted, update the game session and send the message to the clients
  // confirming the rematch
  if (rematchVotes[1 - playerPosition]) {
    Object.assign(gameSession, updateGameSession(gameSession.id));
    broadcastMessage(sockets, "rematch", { gameState: gameSession.gameInstance.gameState(), wins: gameSession.wins });
    return;
  }

  // if the other player hasn't voted yet, mark this player vote and send the other
  // player a message asking for their vote
  gameSession.rematchVotes[playerPosition] = true;
  sendMessage(sockets[1 - playerPosition], "ask-rematch");
}

function handleIncomingMessage(message, playerPosition, gameSession) {
  if (!gameSession) return;
  if (message === "rematch") return handleRematchVote(playerPosition, gameSession);

  const { gameInstance } = gameSession;

  gameActions(message, playerPosition, gameInstance);
}

function initializeGame(webSocket, playerPosition, gameSession) {
  if (!gameSession) return;

  const { gameInstance } = gameSession;

  // replacing the placeholder for the webSokcet connection
  // the connection is stored in the game instance to be used later
  gameInstance.players[playerPosition].ws = webSocket;

  // if the player s the first to join, send a message to wait for the other player
  // and information about the game, so he can display it on the frontend
  // in a waiting interface
  if (playerPosition === 0) {
    sendMessage(webSocket, "waiting", {
      gameId: gameSession.id,
      targetScore: gameInstance.targetScore,
    });
    return;
  }

  // if the player is the second to join, the game can start
  broadcastMessage(gameInstance.getPlayersWs(), "active", {
    gameId: gameSession.id,
    gameState: gameInstance.gameState(),
    yourPosition: playerPosition,
  });
}

function terminateGame(playerPosition, { id, gameInstance }) {
  // if the game has already been removed from the map, there is no need to do anything
  if (!removeGameSession(id)) return;

  // sending a message to the other player that the opponent has quit and closing the connection
  const opponentConnection = gameInstance.getPlayersWs()[1 - playerPosition];
  if (opponentConnection.readyState === WebSocket.OPEN) {
    sendMessage(opponentConnection, "opponent-quit");
    opponentConnection.close();
  }
}

export default function manageGameSession(socket, playerPosition, gameSession) {
  // sending information when the client connect
  initializeGame(socket, playerPosition, gameSession);

  // handling incoming messages from the client
  socket.on("message", (message) => {
    message = message.toString();
    handleIncomingMessage(message, playerPosition, gameSession);
  });

  // finishing the game when the client close the connection
  socket.on("close", () => terminateGame(playerPosition, gameSession));

  // finishing the game if an error occurs in the client connection
  socket.on("error", () => {
    socket.close();
    terminateGame(playerPosition, gameSession);
  });
}
