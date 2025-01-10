import {
  initializePositions,
  winHistoryc,
} from "./gameState.js";
import {
  handleRoll,
  handleHold,
  handleGameStart,
  setInitialGameInfo,
  handleRematch,
  handleGameOver,
} from "./uiManager.js";

let socket;

if (localStorage.getItem("queue") === "true") {
  socket = new WebSocket("ws://localhost:3000/queue");
} else {
  const id = localStorage.getItem("game_id");
  if (!id) window.location.href = "index.html";
  socket = new WebSocket(`ws://localhost:3000/game?id=${id}`);
}

socket.onerror = (error) => {
  localStorage.clear();
  console.log("WebSocket error:", error);
  socket.close();
  window.location.href = "index.html";
};

socket.onopen = () => {
  console.log("Connected to the server");
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    handleSocketMessage(message);
  };
};

function handleSocketMessage(message) {
  switch (message.type) {
    case "waiting":
      setInitialGameInfo(message.gameId, message.targetScore, "Waiting for opponent");
      break;

    case "active":
      initializePositions(message.yourPosition);
      handleGameStart(message.gameId, message.gameState);
      break;

    case "roll":
      handleRoll(message);
      break;

    case "hold":
      handleHold(message.playerState);
      break;

    case "finished": {
      const { playerState } = message;
      winHistoryc[playerState.position]++;
      handleGameOver(playerState.position, playerState.totalScore);
      break;
    }

    case "ask-rematch":
      // TODO
      break;

    case "rematch":
      handleRematch(message.gameState.currentTurn);
      break;

    case "opponent-quit":
      alert("Your opponent has left the game.");
      setTimeout((window.location.href = "index.html"));
      break;

    case "queue-entered":
      waitText.textContent = "Looking for a game";
      break;
    default:
      console.warn(`Unhandled message type: ${message.type}`);
  }
}

export default socket;
