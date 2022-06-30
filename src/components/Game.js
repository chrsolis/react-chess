import React from 'react';
import Board from './Board';
import '../css/game.css';

const amtOfRows = 8;
const amtOfCols = 8;
const totalSquares = amtOfRows * amtOfCols;

const pieceValues = {
  wKing: '♔',
  wQueen: '♕',
  wRook: '♖',
  wBishop: '♗',
  wKnight: '♘',
  wPawn: '♙',
  bKing: '♚',
  bQueen: '♛',
  bRook: '♜',
  bBishop: '♝',
  bKnight: '♞',
  bPawn: '♟',
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: initSquares(),
      }],
      selectedPiece: {
        value: null,
        location: null
      },
      turnNumber: 0,
      whiteTurn: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.turnNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.selectedPiece.value === null && squares[i] !== null) {
      this.setState({
        selectedPiece: {
          value: squares[i],
          location: i,
        }
      });
    } else if (isValidMove(this.selectedPiece, i, squares)) {

    }
  }

  // etc...

  render() {
    const history = this.state.history.slice(0, this.state.turnNumber + 1);
    const current = history[history.length - 1];

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            layout={{
              rows: amtOfRows,
              cols: amtOfCols,
            }}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">

        </div>
      </div>
    );
  }
}

function isValidMove(piece, destination, squares) {
  if (piece.location === null || piece.location === destination || piece.value === null) {
    return false;
  }
  switch (piece.value) {
    case pieceValues.wKing:
    case pieceValues.bKing:

      break;
    case pieceValues.wQueen:
    case pieceValues.bQueen:

      break;
    case pieceValues.wRook:
    case pieceValues.bRook:

      break;
    case pieceValues.wBishop:
    case pieceValues.bBishop:

      break;
    case pieceValues.wKnight:
    case pieceValues.bKnight:

      return false;
    case pieceValues.wPawn:
    case pieceValues.bPawn:
      // If trying to move a pawn forward 1 space, and no other piece is blocking it.
      if (destination === (piece.location + amtOfRows) && squares[destination] === null) {
        return true;
      }
      // If first pawn move and move forward 2 spaces and no other piece is blocking it.
      if (destination === (piece.location + (amtOfRows * 2)) && squares[destination] === null) {
        return true;
      }
      // If trying to take with a pawn, must be piece 1 space diagonal from origin.
      if ((destination === (piece.location + amtOfRows - 1) || destination === (piece.location + amtOfRows + 1)) &&
        (squares[destination] !== null || squares[destination] !== null)) {
        return true;
      }
      // Otherwise, not a valid move.
      return false;
    default:
      return false;
  }
}

function initSquares() {
  const squares = Array(totalSquares).fill(null);
  
  // populating black back row (indexes 0 - 7)
  for (let i = 0; i <= 7; i++) {
    switch (i) {
      case 0:
      case 7:
        squares[i] = pieceValues.bRook;
        break;
      case 1:
      case 6:
        squares[i] = pieceValues.bKnight;
        break;
      case 2:
      case 5:
        squares[i] = pieceValues.bBishop;
        break;
      case 3:
        squares[i] = pieceValues.bQueen;
        break;
      case 4:
        squares[i] = pieceValues.bKing;
        break;
      default:
    }
  }
  // populating black pawns (indexes 8 - 15)
  for (let i = 8; i <= 15; i++) {
    squares[i] = pieceValues.bPawn;
  }
  // populating white back row (indexes 56 - 63)
  // populating black back row (indexes 0 - 7)
  for (let i = 56; i <= 63; i++) {
    switch (i) {
      case 56:
      case 63:
        squares[i] = pieceValues.wRook;
        break;
      case 57:
      case 62:
        squares[i] = pieceValues.wKnight;
        break;
      case 58:
      case 61:
        squares[i] = pieceValues.wBishop;
        break;
      case 59:
        squares[i] = pieceValues.wQueen;
        break;
      case 60:
        squares[i] = pieceValues.wKing;
        break;
      default:
    }
  }
  // populating white pawns (indexes 48 - 55)
  for (let i = 48; i <= 55; i++) {
    squares[i] = pieceValues.wPawn;
  }

  return squares;
}

export default Game;