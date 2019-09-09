import React from 'react';
import Board from './board';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: Array(64).fill(0),
      blackIsNext: true
    };

    this.state.values[calcIdx(3, 3)] = 1;
    this.state.values[calcIdx(4, 4)] = 1;
    this.state.values[calcIdx(3, 4)] = -1;
    this.state.values[calcIdx(4, 3)] = -1;
  }

  handleClick(i) {
    const reversible = this.findReversible(i);

    if (reversible.length === 0) {
      return;
    }

    let next = this.state;
    next.values[i] = this.state.blackIsNext ? 1 : -1;

    reversible.forEach((r) => {
      next.values[r] = this.state.blackIsNext ? 1 : -1;
    });

    next.blackIsNext = !this.state.blackIsNext;
    this.setState(next);
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
        this.state.values[calcIdx(nextR, nextC)] === (this.state.blackIsNext ? 1 : -1)) {
        return;
      }

      nextR += nr;
      nextC += nc;
      while (isRange(nextR) && isRange(nextC)) {
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

  render() {
    return (
      <table className="othello-board">
        <Board
          values={this.state.values}
          onClick={(i) => this.handleClick(i)}
        />
      </table>
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