import socket from "./socketService.js";
import { changeButtonsState } from "./uiManager.js";
import { holdBtn, quitBtn, rematchBtn, rollBtn } from "./tagUtils.js";

rollBtn.addEventListener("click", function () {
  socket.send("roll");
});

holdBtn.addEventListener("click", function () {
  socket.send("hold");
  changeButtonsState(false, rollBtn, holdBtn);
});

rematchBtn.addEventListener("click", () => {
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
