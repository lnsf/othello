import React from 'react';
import Board from './board';
import COMPlayer from './complayer';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: Array(64).fill(0),
      blackIsNext: true,
      black: 2,
      white: 2,
      skipped: false,
      finished: false,
      comPlayer: null
    };

    this.state.values[calcIdx(3, 3)] = 1;
    this.state.values[calcIdx(4, 4)] = 1;
    this.state.values[calcIdx(3, 4)] = -1;
    this.state.values[calcIdx(4, 3)] = -1;

    this.state.values[calcIdx(2, 4)] = 2;
    this.state.values[calcIdx(3, 5)] = 2;
    this.state.values[calcIdx(4, 2)] = 2;
    this.state.values[calcIdx(5, 3)] = 2;
  }

  handleClick(i) {
    if (this.state.comPlayer !== null && this.state.blackIsNext === this.state.comPlayer.comTurnIsBlack) return;

    this.reverseStone(i);
  }

  reverseStone(i) {
    if (this.state.values[i] !== 2) return;

    const reversible = this.findReversible(i);

    if (reversible.length === 0) return;

    let next = this.state;
    next.values[i] = this.state.blackIsNext ? 1 : -1;
    reversible.forEach((r) => {
      next.values[r] = this.state.blackIsNext ? 1 : -1;
    });

    next.blackIsNext = !this.state.blackIsNext;

    next.black = this.count(1);
    next.white = this.count(-1);
    next.skipped = false;

    for (let i = 0; i < 64; i++) {
      if (this.state.values[i] === 1 || this.state.values[i] === -1)
        next.values[i] = this.state.values[i];
      else if (this.findReversible(i).length >= 1)
        next.values[i] = 2;
      else
        next.values[i] = 0;
    };

    this.setState(next);

    if (!this.state.values.includes(2)) {
      let next = this.state;
      next.blackIsNext = !next.blackIsNext;
      for (let i = 0; i < 64; i++) {
        if (this.state.values[i] === 1 || this.state.values[i] === -1)
          next.values[i] = this.state.values[i];
        else if (this.findReversible(i).length >= 1)
          next.values[i] = 2;
        else
          next.values[i] = 0;
      };

      if (!next.values.includes(2))
        next.finished = true;
      else
        next.skipped = true;

      this.setState(next);
    }
  }

  findPlaceableIndexes(){
    let indexes = [];
    for(let i = 0; i < this.state.values.length; i++){
      if(this.state.values[i] === 2)
        indexes.push(i);
    }

    return indexes;
  }

  handleComPlayerToggle(toggleColorIsBlack){
    if(this.state.comPlayer === null || this.state.comPlayer.comTurnIsBlack !== toggleColorIsBlack)
      this.enableComPlayer(toggleColorIsBlack);
    else
      this.disableComPlayer();
  }
  
  enableComPlayer(comTurnIsBlack){
    this.setState({
      comPlayer: new COMPlayer(comTurnIsBlack)
    });
  }

  disableComPlayer(){
    this.setState({
      comPlayer: null
    });
  }

  findReversible(i) {
    let reversible = [];
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, 0],
      [1, -1]
    ].forEach(([nr, nc]) => {
      const isRange = (i) => (0 <= i && i < 8);

      let [r, c] = calcRC(i);
      let [nextR, nextC] = [r + nr, c + nc];
      let reversibleInLine = [calcIdx(nextR, nextC)];
      if (!isRange(nextR) || !isRange(nextC) ||
        this.state.values[calcIdx(nextR, nextC)] === 0 ||
        this.state.values[calcIdx(nextR, nextC)] === 2 ||
        this.state.values[calcIdx(nextR, nextC)] === (this.state.blackIsNext ? 1 : -1)) {
        return;
      }

      nextR += nr;
      nextC += nc;
      while (isRange(nextR) && isRange(nextC)) {
        if (this.state.values[calcIdx(nextR, nextC)] === 0 ||
          this.state.values[calcIdx(nextR, nextC)] === 2) {
          return;
        }
        if (this.state.values[calcIdx(nextR, nextC)] === (this.state.blackIsNext ? 1 : -1)) {
          reversible = reversible.concat(reversibleInLine);
          return;
        }
        reversibleInLine.push(calcIdx(nextR, nextC));
        nextR += nr;
        nextC += nc;
      }
    });

    return reversible;
  }

  count(s) {
    const sorted = this.state.values.slice().sort();
    const first = sorted.indexOf(s);
    const last = sorted.lastIndexOf(s);
    if (first === -1) {
      return 0;
    }
    return last - first + 1;
  }

  componentDidUpdate(){
    if(this.state.finished){  
      setTimeout(() => {
        let winner;
        if(this.state.black > this.state.white)
          winner = "Black";
        else if(this.state.black < this.state.white)
          winner = "White";
        else
          winner = null;

        winner ? alert("Winner is " + winner) :
                 alert("Draw")
      }, 1);
    }
    else if(this.state.skipped){
      setTimeout(() => {
        alert("Skip\n" + 
              "Next turn is " + (this.state.blackIsNext ? "Black" : "White"));
      }, 1);
    }
    else if(this.state.comPlayer !== null && this.state.comPlayer.comTurnIsBlack === this.state.blackIsNext){
      setTimeout(() => {
        this.reverseStone(this.state.comPlayer.placeStone(
          this.findPlaceableIndexes()
        ));
      }, 1000);
    }
  }

  render() {
    return (
      <div>
        <div className="horizontal">
          <div className="status-inner" id="status-black">
            <h2>Black</h2>
            <h3>{this.state.black}</h3>
            <h3>{this.state.blackIsNext ? "TURN" : "-"}</h3>
            <button onClick={() => this.handleComPlayerToggle(true)}>
              {this.state.comPlayer === null || !this.state.comPlayer.comTurnIsBlack ? " " : "COM"}
            </button>
          </div>
          <div className="status-inner" id="status-white">
            <h2>White</h2>
            <h3>{this.state.white}</h3>
            <h3>{this.state.blackIsNext ? "-" : "TURN"}</h3>
            <button onClick={() => this.handleComPlayerToggle(false)}>
            {this.state.comPlayer === null || this.state.comPlayer.comTurnIsBlack ? " " : "COM"}
            </button>
          </div>
        </div>
        <Board
          values={this.state.values}
          onClick={(i) => this.handleClick(i)}
        />
      </div>
    );
  }
}

function calcIdx(row, col) {
  return 8 * row + col;
}

function calcRC(idx) {
  return [Math.floor(idx / 8), idx % 8];
}

export default Game;
