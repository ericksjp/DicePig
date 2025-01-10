export default class Game {
  #winnerPosition;
  #currentTurn;

  constructor(targetScore = 50, startingPlayer = 0, playerSockets = [undefined, undefined]) {
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
    this.#winnerPosition = null;

    let count;
    this.players = playerSockets.map((ws, i) => {
      ws && count++;
      return {
        ws,
        totalScore: 0,
        currentScore: 0,
        position: i,
      }
    })

    this.status = count === 2 ? "active" : "waiting";
  }

  getWinnerPosition() {
    return this.#winnerPosition;
  }

  getCurrentTurn() {
    return this.#currentTurn;
  }

  addPlayer(ws, position) {
    position = position || this.players[0].ws ? 1 : 0;
    if (position < 0 || position > 1) throw new Error("Invalid player position");
    if (this.players[position].ws) throw new Error("Cannot add player at this position: Position is already taken");

    this.players[position].ws = ws;
    this.players[1 - position].ws && (this.status = "active");

    return position;
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
