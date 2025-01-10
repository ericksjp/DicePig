import { createGameBtn, searchGameBtn } from "./tagUtils.js";

export function toggleSearchGameButton(active) {
  if (active) {
    searchGameBtn.textContent = "LOOKING FOR GAME ...";
    searchGameBtn.classList.add("active--btn");
    createGameBtn.disabled = true;
    createGameBtn.classList.add("disabled");
    return;
  }

  searchGameBtn.textContent = "SEARCH FOR GAME";
  searchGameBtn.classList.remove("active--btn");
  createGameBtn.disabled = false;
  createGameBtn.classList.remove("disabled");
}
