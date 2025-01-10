export let playerPosition = null;
export let opponentPosition = null;
export let rematchAnimDirection = null;

export const winHistoryc = [0, 0];

export function initializePositions(playerStartPosition) {
  playerPosition = playerStartPosition;
  opponentPosition = 1 - playerStartPosition;
}

export function toggleRematchAnimationDirection() {
  if (!rematchAnimDirection) return;
  let dir = rematchAnimDirection === "ltc" ? "ctr" : "ctl";
  rematchAnimDirection = null;
  return dir;
}

export function determineRematchAnimationDirection(playerStartPosition) {
  rematchAnimDirection = playerStartPosition === 0 ? "ltc" : "rtc";
  return rematchAnimDirection;
}
