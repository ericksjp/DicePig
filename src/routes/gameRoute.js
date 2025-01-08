// TODO refactor this code

import { Router } from "express";
import { createGameSession, hasGameSession } from "../services/gameSessionService.js";
import Game from "../models/game.js";

const router = Router();

router.post("/new", (req, res) => {
  const { targetScore, startingPlayer } = req.body;

  if (typeof targetScore !== "number" || targetScore < 1) {
    return res.status(422).json({ message: "Invalid targetScore value" });
  }

  if (typeof startingPlayer !== "number" || startingPlayer > 1 || startingPlayer < 0) {
    return res.status(422).json({ message: "Invalid startingPlayer value" });
  }

  const { id } = createGameSession(new Game(targetScore, startingPlayer));

  // the client will use this id to attach to the game socket
  res.status(201).json({ id });
});

router.get("/join/:id", (req, res) => {
  const { id } = req.params;

  if (!id?.trim()) return res.status(422).json({ message: "Invalid game id" });

  if (!hasGameSession(id)) return res.status(404).json({ message: "Game not found" });

  // with the 204 status code, the client will know that he can join the game socket with the provided id
  return res.status(204).send();
});

export default router;
