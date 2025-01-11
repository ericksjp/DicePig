import { redirect } from "../helpers.js";

export async function createGame(targetScore, startingPlayer, isPublic) {
  startingPlayer--;
  try {
    const resp = await fetch("http://localhost:80/api/game/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetScore,
        startingPlayer,
        isPublic,
      }),
    });
    if (resp.status === 201) {
      const data = await resp.json();
      redirect(data.id);
    }
  } catch (error) {
    console.error("error creating game:", error);
  }
}

export async function joinGame(gameId) {
  try {
    const resp = await fetch(`http://localhost:80/api/game/join/${gameId}`, {
      method: "GET",
    });
    if (resp.status === 204) {
      redirect(gameId);
    }
  } catch (error) {
    console.error("error joining game:", error);
  }
}
