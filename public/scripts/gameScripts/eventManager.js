import socket from "./socketService.js";
import { changeButtonsState, handleRematchAnimation } from "./uiManager.js";
import { holdBtn, quitBtn, rematchBtn, rollBtn } from "./tagUtils.js";
import {
  determineRematchAnimationDirection,
  playerPosition,
  rematchAnimDirection,
} from "./gameState.js";

rollBtn.addEventListener("click", function () {
  socket.send("roll");
});

holdBtn.addEventListener("click", function () {
  socket.send("hold");
  changeButtonsState(false, rollBtn, holdBtn);
});

rematchBtn.addEventListener("click", () => {
  if (!rematchAnimDirection) {
    determineRematchAnimationDirection(playerPosition);
    handleRematchAnimation(rematchAnimDirection);
  }
  socket.send("rematch");
  changeButtonsState(false, rematchBtn);
});

quitBtn.addEventListener("click", () => {
  socket.close();
  window.location.href = "index.html";
});

window.addEventListener('beforeunload', () => {
  localStorage.clear();
});
