import { playerPosition, winHistoryc } from "./gameState.js";
import {
  targetScore,
  rematchBtn,
  gameId,
  gameDice,
  playerTags,
  rollBtn,
  holdBtn,
  gameWaiterDiv,
  mainTag,
  footerTag,
  waitText,
  gameScore,
} from "./tagUtils.js";

export function setDiceValue(value) {
  gameDice.setAttribute("src", `./assets/dice-${value}.png`);
}

export function moveDice(pos) {
  if (pos >= 0) {
    gameDice.classList.remove(
      1 - pos === 0 ? "dice__player1" : "dice__player2",
    );
    gameDice.classList.add(pos === 0 ? "dice__player1" : "dice__player2");
  } else {
    gameDice.classList.remove("dice__player1", "dice__player2");
  }
  setTimeout(() => {
    setDiceValue("0");
  }, 300);
}

export function setPlayerTag(player, playerNumber) {
  const playerTag = playerTags[playerNumber];
  playerTag.indicator.textContent =
    player.position === playerPosition ? "You" : "Enemy";
  player.isTurn && playerTag.section.classList.add("active");
}

export function updatePlayerTag(player) {
  const tags = playerTags[player.position];
  tags.totalScore.textContent = player.totalScore;
  tags.currentScore.textContent = player.currentScore;
}

export function toggleActivePlayer(position) {
  playerTags[position].section.classList.add("active");
  playerTags[1 - position].section.classList.remove("active");
}

export function handleHold(playerState) {
  const { position } = playerState;
  updatePlayerTag(playerState);
  setDiceValue("0");
  moveDice(1 - position);
  changeButtonsState(playerPosition === 1 - position, rollBtn, holdBtn);
  toggleActivePlayer(1 - position);
}

export function handleRoll(play) {
  setDiceValue(play.result);
  if (play.result === 1) {
    setTimeout(() => {
      handleHold(play.playerState);
    }, 200);
  } else updatePlayerTag(play.playerState);
}

export function changeButtonsState(enabled, ...buttons) {
  if (enabled) {
    buttons.forEach((btn) => {
      btn.classList.remove("disabled");
      btn.disabled = false;
    });
  } else {
    buttons.forEach((btn) => {
      btn.classList.add("disabled");
      btn.disabled = true;
    });
  }
}

export function setInitialGameInfo(id, targetScoreArg, waiterTextArg) {
  waiterTextArg && (waitText.textContent = waiterTextArg);
  gameId.textContent = "Game id: " + id;
  targetScore.textContent = "Target Score: " + targetScoreArg;
}

export function handleGameStart(gameId, gameState) {
  const { players, currentTurn, targetScore } = gameState;

  if (playerPosition === 1) setInitialGameInfo(gameId, targetScore);

  players.forEach((player, index) => setPlayerTag(player, index));

  if (currentTurn === playerPosition) {
    changeButtonsState(true, holdBtn, rollBtn);
  }

  gameWaiterDiv.classList.add("hidden");
  mainTag.classList.remove("hidden");
  footerTag.classList.remove("footer--hidden");
  gameScore.classList.remove("hidden");

  moveDice(currentTurn);
}

export function handleRematch(activePlayerIndex) {
  playerTags.forEach((tag) => {
    tag.totalScore.textContent = 0;
    tag.currentScore.textContent = 0;
    tag.resultIndicator.textContent = "";
    tag.resultIndicator.classList.add("hidden");
    tag.section.classList.remove("winner", "loser", "game-over");
  });

  moveDice(activePlayerIndex);
  activePlayerIndex === playerPosition && changeButtonsState(true, holdBtn, rollBtn);
}

export function handleGameOver(winnerPosition, finalScore) {
  playerTags.forEach(
    ({ section, totalScore, resultIndicator, wins }, index) => {
      if (index == winnerPosition) {
        wins.textContent = winHistoryc[winnerPosition];
        section.classList.add("game-over", "winner");
        resultIndicator.textContent = "🥳🥳🥳";
        totalScore.textContent = finalScore;
      } else {
        section.classList.add("game-over", "loser");
        resultIndicator.textContent = "😭😭😭";
      }
      resultIndicator.classList.remove("hidden");
    },
  );
  moveDice(-1);
  changeButtonsState(false, rollBtn, holdBtn);
  changeButtonsState(true, rematchBtn);
}
