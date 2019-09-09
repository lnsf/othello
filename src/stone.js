import React from 'react';

function Stone(props) {
  let stone;
  switch (props.color) {
    case 1:
      stone = (<div className="stone black" />);
      break;
    case -1:
      stone = (<div className="stone white" />);
      break;
    case 2:
      stone = (<div className="stone placeable" />);
      break;
    default:
      stone = (<div className="stone green" />);
      break;
  }
  return (
    <td className="othello-board" onClick={props.onClick}>
      {stone}
    </td>
  );
}

export default Stone;
