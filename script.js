'use strict';

// elements
const rollBTN = document.querySelector('.btn--roll');
const holdBTN = document.querySelector('.btn--hold');
const newBTN = document.querySelector('.btn--new');
const dice = document.querySelector('.dice');

// control
let currentPlayer;
const playerObj = {};

// functions
function start() {
  if (currentPlayer === 1 || currentPlayer === 0) {
    switchPlayer();
  } else {
    currentPlayer = 0;
    dice.classList.add('turn-left');
  }

  for (let c = 0; c < 2; c++) {
    playerObj[c] = {
      totalScore: 0,
      currentScore: 0,
      domElement: document.querySelector(`.player--${c}`),
    };
    document.querySelector(`#score--${c}`).textContent = 0;
    document.querySelector(`#current--${c}`).textContent = 0;
  }
}
start();

function getNum() {
  return Math.trunc(Math.random() * 6 + 1);
}

// change dice pic
function displayRoll(num) {
  dice.setAttribute('src', `./assets/dice-${num}.png`);
}

// toggle animation
function moveDice() {
  dice.classList.toggle('turn-left');
  dice.classList.toggle('turn-right');
  setTimeout(() => {
    dice.setAttribute('src', `white-dice.png`);
  }, 300);
}

function toggleButtons() {
  const buttons = document.querySelectorAll('.btn');
  for (const button of buttons) {
    button.disabled = !button.disabled;
    button.classList.toggle('disabled');
  }
}

function declareWinner() {
  const result = document.createElement('span');
  result.classList.add('result');
  result.textContent = ' WINS!!';
  document.querySelector(`#name--${currentPlayer}`).appendChild(result);
  toggleButtons();
}

function switchPlayer() {
  resetCurrentScore(currentPlayer);
  playerObj[0].domElement.classList.toggle('player--active');
  playerObj[1].domElement.classList.toggle('player--active');
  currentPlayer = currentPlayer === 1 ? 0 : 1;
  moveDice();
}

function resetCurrentScore(player) {
  playerObj[player].currentScore = 0;
  document.querySelector(`#current--${player}`).textContent = '0';
}

function updateCurrentScore(player, num) {
  if (num === 1) switchPlayer();
  else {
    const score = (playerObj[player].currentScore += num);
    document.querySelector(`#current--${player}`).textContent = score;
  }
}

function updateTotalScore(player) {
  const score = (playerObj[player].totalScore +=
    playerObj[player].currentScore);
  document.querySelector(`#score--${player}`).textContent = score;

  if (score >= 100) {
    declareWinner(player);
  } else {
    switchPlayer();
  }
}

// event listeners
rollBTN.addEventListener('click', function () {
  const num = getNum();
  displayRoll(num);
  updateCurrentScore(currentPlayer, num);
});

holdBTN.addEventListener('click', function () {
  updateTotalScore(currentPlayer);
});

newBTN.addEventListener('click', () => {
  document.querySelector('.result').remove();
  toggleButtons();
  start();
});
