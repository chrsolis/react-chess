import React from 'react';
import Square from './Square';
import '../css/board.css';

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        location={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(row) {
    const squares = [];
    const offset = row * this.props.layout.rows;
    for (let s = 0; s < this.props.layout.rows; s++) {
      squares.push(this.renderSquare(offset + s));
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    );
  }

  render() {
    const rows = [];
    for (let r = 0; r < this.props.layout.cols; r++) {
      rows.push(
        this.renderRow(r)
      );
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

export default Board;