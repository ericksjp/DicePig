// the playerQueue will hold sockets that are waiting for a game to be available
// and the gameQueue will hold the ids of the games that are waiting for a player
const playerQueue = new Set();
const gameQueue = new Set();

export function addPlayerToQueue(ws) {
  if (playerQueue.size === 0 && gameQueue.size > 0) {
    const value = gameQueue.values().next().value;
    gameQueue.delete(value);
    return value;
  }
  playerQueue.add(ws);
}

export function removePlayerFromQueue(ws) {
  playerQueue.delete(ws);
}

export function addGameToQueue(id) {
  if (playerQueue.size > 0 && gameQueue.size === 0) {
    const ws = playerQueue.values().next().value;
    ws.emit("game-found", id)
    return;
  }

  gameQueue.add(id);
}

export function removeGameFromQueue(id) {
  gameQueue.delete(id);
}

//toremove
export function queuedata() {
  return { player: playerQueue.size, game: gameQueue.size };
}
