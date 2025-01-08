import Game from "../models/game.js";
import { generateId } from "../utils/index.js";

const gameSessions = new Map();

export function createGameSession(firstGame) {
  if (!firstGame) throw new Error("The First Game is required");

  const id = generateId();

  // TODO Refactor this to a class
  const session = { game: firstGame, wins: [], rematchVotes: [false, false] };

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
  const { game } = oldSession;
  if (game.status !== "finished") return;

  const newSession = {
    game: new Game(game.targetScore, 0, game.getPlayerIds()),
    wins: [oldSession.wins, ...game.getWinner()],
    rematchVotes: [false, false],
  };

  gameSessions.set(id, newSession);
  return newSession;
}

export function removeGameSession(id) {
  return gameSessions.delete(id);
}
