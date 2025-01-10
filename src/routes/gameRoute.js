// TODO refactor this code

import { Router } from "express";
import { createGameSession, hasGameSession, removeGameSession } from "../services/gameSessionService.js";
import Game from "../models/game.js";

const router = Router();

router.post("/new", (req, res) => {
  let { targetScore = 50, startingPlayer = 0, isPublic = 1 } = req.body;

  targetScore = parseInt(targetScore)
  startingPlayer = parseInt(startingPlayer)
  isPublic = parseInt(isPublic);

  if (typeof targetScore !== "number" || targetScore < 1) {
    return res.status(422).json({ message: "Invalid targetScore value" });
  }

  if (typeof startingPlayer !== "number" || (startingPlayer !== 0 && startingPlayer !== 1)) {
    return res.status(422).json({ message: "Invalid startingPlayer value" });
  }

  if (typeof isPublic !== "number" || (isPublic !== 0 && isPublic !== 1)) {
    return res.status(422).json({ message: "Invalid isPublic value" });
  }

  const gameSession = createGameSession(new Game(targetScore, startingPlayer));
  const { id } = gameSession;

  // the client will use this id to attach to the game socket
  res.status(201).json({ id });

  // after one second, if the player dont connect the game will be removed from the map
  // if the player connects, the game will be added to the queue
  setTimeout(()=> {
    if (hasGameSession(id)) {
      if (!gameSession.gameInstance.players[0].ws) {
        removeGameSession(id);
      } else {
        isPublic && addGameToQueue(id);
      }
    }
  }, 1000)
});

router.get("/join/:id", (req, res) => {
  const { id } = req.params;

  if (!id?.trim()) return res.status(422).json({ message: "Invalid game id" });

  if (!hasGameSession(id)) return res.status(404).json({ message: "Game not found" });

  // with the 204 status code, the client will know that he can join the game socket with the provided id
  return res.status(204).send();
});

export default router;
