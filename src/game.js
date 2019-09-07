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
    let next = this.state;
    next.values[i] = this.state.blackIsNext ? 1 : -1;
    next.blackIsNext = !this.state.blackIsNext;

    this.setState(next);
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

export default Game;