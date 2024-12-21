const toggle = document.querySelector("#toggle-name-change");
const createGame = document.querySelector("#new-game-btn");
const cancelGame = document.querySelector("#cancel-btn");
const gameForm = document.querySelector(".game-form");
const pname = document.querySelector("#player-name");
const pnameinput = document.querySelector("#player-name-input");

function toggleNameChange() {
  pname.classList.toggle("hidden");
  pnameinput.classList.toggle("hidden");
  pnameinput.focus();
}

function toggleFormNewGame() {
  gameForm.classList.toggle("hidden");
  createGame.classList.toggle("hidden");
}

toggle.addEventListener("click", () => {
  toggleNameChange();
});

pnameinput.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    toggleNameChange();
  }
  if (event.key === "Enter") {
    pname.textContent = pnameinput.value;
    toggleNameChange();
  }
});

createGame.addEventListener("click", () => {
  toggleFormNewGame();
});

cancelGame.addEventListener("click", () => {
  toggleFormNewGame();
});
