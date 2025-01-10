import { redirect } from "../helpers.js";

export async function createGame(targetScore, startingPlayer, isPublic) {
  startingPlayer--;
  try {
    const resp = await axios.post("http://localhost:3000/game/new", {
      targetScore,
      startingPlayer,
      isPublic,
    });
    resp.status === 201 && redirect(resp.data.id);
  } catch (error) {
    console.error("error creating game:", error);
  }
}

export async function joinGame(gameId) {
  try {
    const resp = await axios.get(`http://localhost:3000/game/join/${gameId}`);
    resp.status === 204 && redirect(gameId);
  } catch (error) {
    console.error("error joining game:", error);
  }
}
