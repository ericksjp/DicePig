"use strict";

export const targetScore = document.querySelector("#targetScore");
export const gameScore = document.querySelector("#gameScore");
export const gameTitle = document.querySelector("#gameTitle");
export const gameId = document.querySelector("#gameId");

export const gameWaiterDiv = document.querySelector("#gameWaiter");
export const waitText = document.querySelector("#waitText");
export const mainTag = document.querySelector("#gameMain");
export const footerTag = document.querySelector("#gameFooter");

export const rollBtn = document.querySelector("#btnRoll");
export const holdBtn = document.querySelector("#btnHold");
export const rematchBtn = document.querySelector("#btnRematch");
export const quitBtn = document.querySelector("#btnQuit");

export const gameDice = document.querySelector("#gameDice");

export const playerTags = [
  {
    wins: document.querySelector("#player1wins"),
    section: document.querySelector("#player1Section"),
    indicator: document.querySelector("#player1Indicator"),
    resultIndicator: document.querySelector("#player1ResultIndicator"),
    loader: document.querySelector("#player1Loader"),
    totalScore: document.querySelector("#player1TotalScore"),
    currentScore: document.querySelector("#player1CurrentScore"),
  },

  {
    wins: document.querySelector("#player2wins"),
    section: document.querySelector("#player2Section"),
    indicator: document.querySelector("#player2Indicator"),
    resultIndicator: document.querySelector("#player2ResultIndicator"),
    loader: document.querySelector("#player2Loader"),
    totalScore: document.querySelector("#player2TotalScore"),
    currentScore: document.querySelector("#player2CurrentScore"),
  },
];
