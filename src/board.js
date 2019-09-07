import React from 'react';
import Stone from './stone'

class Board extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      values: props.values
    }
  }

  renderStone(i){
    return(
      <Stone color={this.state.values[i]} onClick={() => this.props.onClick(i)} />
    );
  }

  render(){
    const createRow = (r) => {
      let innerRow = [];
      for(let i = 8 * r; i < 8 * (r + 1); i++){
        innerRow.push(this.renderStone(i));
      }
      return (<tr className="othello-board">{innerRow}</tr>);
    };

    const createTable = () => {
      let table = [];
      for(let i = 0; i < 8; i++)
        table.push(createRow(i));
      return table;
    };

    return createTable();
  };
}

export default Board;