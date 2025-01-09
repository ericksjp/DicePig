export default class Game {
  #winnerPosition;
  #currentTurn;

  constructor(targetScore = 50, startingPlayer = 0, playerSockets = [], id) {
    if (startingPlayer >= 2 || startingPlayer < 0) {
      throw new Error("Invalid starter position");
    }
    if (targetScore < 1) {
      throw new Error("Invalid target score");
    }
    if (playerSockets.length > 2) {
      throw new Error("Invalid number of players");
    }

    this.targetScore = targetScore;
    this.#currentTurn = startingPlayer;
    this.id = id;
    this.#winnerPosition = null;

    this.players = playerSockets.map((ws, i) => ({
      ws,
      totalScore: 0,
      currentScore: 0,
      position: i,
    }));

    this.status = this.players.length === 2 ? "active" : "waiting";
  }

  getWinnerPosition() {
    return this.#winnerPosition;
  }

  getCurrentTurn() {
    return this.#currentTurn;
  }

  addPlayer(ws) {
    if (this.players.length === 2) throw new Error("Cannot add more players: Game is full");

    this.players.push({
      ws,
      totalScore: 0,
      currentScore: 0,
      position: this.players.length,
    });

    if (this.players.length === 2) this.status = "active";

    return this.players.length - 1;
  }

  getPlayersWs() {
    return this.players.map((p) => p.ws);
  }

  findPlayerPositionByWsInstance(ws) {
    return this.players.findIndex(player => player.socket === ws);
  }

  roll(playerPosition) {
    this.#validatePlayerAction(playerPosition);

    const diceResult = Math.floor(Math.random() * 6) + 1;

    // If the result is 1, the player loses their current score and the turn changes
    if (diceResult === 1) {
      this.players[playerPosition].currentScore = 0;
      this.#changeTurn();
    } else {
      this.players[playerPosition].currentScore += diceResult;
    }

    return diceResult;
  }

  // verify after every hold if the game is over
  hold(playerPosition) {
    this.#validatePlayerAction(playerPosition);

    const player = this.players[playerPosition];

    player.totalScore += player.currentScore;
    player.currentScore = 0;

    this.#changeTurn();

    // if the player reaches the target score, the game is over
    if (player.totalScore >= this.targetScore) {
      this.status = "finished";
      this.#winnerPosition = playerPosition;
    }

    return player.totalScore;
  }

  playerState(pos) {
    if (pos < 0 || pos >= this.players.length) throw new Error("Invalid player position");
    
    return {
      ...this.players[pos],
      ws: undefined, // remove the socket from the state
      isTurn: pos === this.#currentTurn,
    };
  }

  gameState() {
    return {
      id: this.gameId,
      status: this.status,
      currentTurn: this.#currentTurn,
      targetScore: this.targetScore,
      winner: this.#winnerPosition,
      players: this.players.map((_, i) => this.playerState(i)),
    };
  }

  // function to verify if the player can make the move
  #validatePlayerAction(playerPosition) {
    if (this.status !== "active") {
      throw new Error("The game is not active");
    }

    if (playerPosition !== this.#currentTurn) {
      throw new Error("Not this player's turn");
    }
  }

  #changeTurn() {
    this.#currentTurn = 1 - this.#currentTurn;
  }
}
