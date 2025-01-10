export let playerPosition = null;
export let opponentPosition = null;

export const winHistoryc = [0, 0];

export function initializePositions(playerStartPosition) {
  playerPosition = playerStartPosition;
  opponentPosition = 1 - playerStartPosition;
}
