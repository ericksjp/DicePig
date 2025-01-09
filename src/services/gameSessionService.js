import Game from "../models/game.js";
import { generateId } from "../utils/index.js";

const gameSessions = new Map();

export function createGameSession(firstGame) {
  if (!firstGame) throw new Error("The First Game is required");

  const id = generateId();

  // TODO Refactor this to a class
  const session = { id, gameInstance: firstGame, wins: [], rematchVotes: [false, false] };

  gameSessions.set(id, session);
  return session;
}

export function getGameSession(id) {
  return gameSessions.get(id);
}

export function hasGameSession(id) {
  return gameSessions.has(id);
}

export function updateGameSession(id) {
  const oldSession = gameSessions.get(id);
  if (!oldSession) return;
  const { gameInstance } = oldSession;
  if (gameInstance.status !== "finished") return;
  const winner = gameInstance.getWinnerPosition();

  // the starting player will be the player that won the last game
  const newSession = {
    id,
    gameInstance: new Game(gameInstance.targetScore, winner, gameInstance.getPlayersWs()),
    wins: [...oldSession.wins, winner],
    rematchVotes: [false, false],
  };

  gameSessions.set(id, newSession);
  return newSession;
}

export function removeGameSession(id) {
  return gameSessions.delete(id);
}
