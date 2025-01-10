import { constrainValue } from "../helpers.js";
import { createGame, joinGame } from "./httpService.js";
import {
  createGameBtn,
  targetScoreOption,
  starterOption,
  searchGameBtn,
  gameIdInput,
  joinGameBtn,
  privacyOptions,
} from "./tagUtils.js";

createGameBtn.addEventListener("click", async () => {
  const targetScore = targetScoreOption.value;
  const starter = starterOption.value;
  const isPublic = document.querySelector(".privacy.active")?.value || 1;

  await createGame(targetScore, starter, isPublic);
});

joinGameBtn.addEventListener("click", async () => {
  const gameId = gameIdInput.value.trim();
  if (!gameId) return;
  await joinGame(gameId);
});

searchGameBtn.addEventListener("click", () => {
  localStorage.removeItem("game_id");
  localStorage.setItem("queue", true);
  window.location.href = "game.html";
});

gameIdInput.addEventListener("focusout", () => {
  joinGameBtn.disabled = gameIdInput.value.trim() === "";
});

starterOption.addEventListener("focusout", () => {
  starterOption.value = constrainValue(starterOption.value, 1, 1, 2);
});

targetScoreOption.addEventListener("focusout", () => {
  targetScoreOption.vale = constrainValue(targetScoreOption.value, 100, 1, 1000);
});

privacyOptions.forEach((option, i) => {
  option.addEventListener("click", () => {
    option.classList.add("active");
    privacyOptions[1 - i].classList.remove("active");
  });
});
