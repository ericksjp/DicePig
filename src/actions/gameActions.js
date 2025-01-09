import { broadcastMessage, sendMessage } from "../utils/index.js";

function gameOver(gameInstance, sockets) {
  const winner = gameInstance.getWinnerPosition();
  broadcastMessage(sockets, "finished", {
    playerState: gameInstance.playerState(winner),
  });
}

function roll(position, gameInstance, sockets) {
  try {
    const result = gameInstance.roll(position);

    // send the result of the roll and the player state of the player that rolled
    broadcastMessage(sockets, "roll", {
      result,
      playerState: gameInstance.playerState(position),
    });
  } catch (error) {
    sendMessage(sockets[position], "invalid", {
      message: "Invalid roll: " + error.message,
    });
  }
}

function hold(position, gameInstance, sockets) {
  try {
    const totalScore = gameInstance.hold(position);
    // if the totalScore is greater or equal to the target score, inform the players that the game is over
    if (totalScore >= gameInstance.targetScore)
      return gameOver(gameInstance, sockets);

    // send the player state of the player that held
    broadcastMessage(sockets, "hold", {
      playerState: gameInstance.playerState(position),
    });
  } catch (error) {
    sendMessage(sockets[position], "invalid", {
      message: "Invalid hold: " + error.message,
    });
  }
}

const actions = { roll, hold };

export default function gameActions(action, position, gameInstance) {
  const sockets = gameInstance.getPlayersWs();
  const actionHandler = actions[action];
  if (actionHandler) return actionHandler(position, gameInstance, sockets);

  sendMessage(sockets[position], "invalid", {
    message: "Invalid action: the available actions are 'hold', 'roll', and 'rematch'"
  });
}
