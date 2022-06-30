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

    if (this.state.selectedPiece.value === null && squares[i] !== null && isTurn(this.state.whiteTurn, squares[i])) {
      this.setState({
        selectedPiece: {
          value: squares[i],
          location: i,
        }
      });
    } else if (isTurn(this.state.whiteTurn, this.state.selectedPiece.value) && isValidMove(this.state.selectedPiece, i, squares)) {
      squares[i] = this.state.selectedPiece.value;
      squares[this.state.selectedPiece.location] = null;
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        selectedPiece: {
          value: null,
          location: null,
        },
        turnNumber: history.length,
        whiteTurn: !this.state.whiteTurn,
      });
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
  // temporary return while testing
  if (piece.location === null || piece.location === destination || piece.value === null) {
    return false;
  }
  switch (piece.value) {
    case pieceValues.wKing:
    case pieceValues.bKing:

      return true;
    case pieceValues.wQueen:
    case pieceValues.bQueen:

      return true;
    case pieceValues.wRook:
    case pieceValues.bRook:

      return true;
    case pieceValues.wBishop:
    case pieceValues.bBishop:

      return true;
    case pieceValues.wKnight:
    case pieceValues.bKnight:
      // If trying to move a knight over another piece of the same color
      if (squares[destination] !== null && isWhite(squares[destination]) === isWhite(piece.value)) {
        return false;
      }
      // Valid positions a knight can move based on board index
      if (destination === (piece.location + 6) || destination === (piece.location - 6)) {
        return true;
      }
      if (destination === (piece.location + 10) || destination === (piece.location - 10)) {
        return true;
      }
      if (destination === (piece.location + 15) || destination === (piece.location - 15)) {
        return true;
      }
      if (destination === (piece.location + 17) || destination === (piece.location - 17)) {
        return true;
      }
      return false;
    case pieceValues.wPawn:
      // If trying to move a pawn over another piece of the same color
      if (squares[destination] !== null && isWhite(squares[destination]) === isWhite(piece.value)) {
        return false;
      }
      // If trying to move a pawn forward 1 space, and no other piece is blocking it.
      if (destination === (piece.location - amtOfRows) && squares[destination] === null) {
        return true;
      }
      if (destination === (piece.location - (amtOfRows * 2)) && squares[destination] === null &&
        piece.value === pieceValues.wPawn && piece.location >= 48 && piece.location <= 55) {
        return true;
      }
      // If trying to take with a pawn, must be piece 1 space diagonal from origin.
      if ((destination === (piece.location - amtOfRows - 1) || destination === (piece.location - amtOfRows + 1)) &&
        (squares[destination] !== null) && !isWhite(squares[destination])) {
        return true;
      }
      // Otherwise, not a valid move.
      return false;
    case pieceValues.bPawn:
      // If trying to move a pawn over another piece of the same color
      if (squares[destination] !== null && isWhite(squares[destination]) === isWhite(piece.value)) {
        return false;
      }
      // If trying to move a pawn forward 1 space, and no other piece is blocking it.
      if (destination === (piece.location + amtOfRows) && squares[destination] === null) {
        return true;
      }
      // If first pawn move and move forward 2 spaces and no other piece is blocking it.
      if (destination === (piece.location + (amtOfRows * 2)) && squares[destination] === null &&
        piece.value === pieceValues.bPawn && piece.location >= 8 && piece.location <= 15) {
        return true;
      }
      // If trying to take with a pawn, must be piece 1 space diagonal from origin.
      if ((destination === (piece.location + amtOfRows - 1) || destination === (piece.location + amtOfRows + 1)) &&
        (squares[destination] !== null) && isWhite(squares[destination])) {
        return true;
      }
      // Otherwise, not a valid move.
      return false;
  }
}

function isTurn(whiteTurn, pieceValue) {
  if (whiteTurn && isWhite(pieceValue)) {
    return true;
  }
  if (!whiteTurn && !isWhite(pieceValue)) {
    return true;
  }
  return false;
}

function isWhite(pieceValue) {
  switch (pieceValue) {
    case pieceValues.wKing:
    case pieceValues.wQueen:
    case pieceValues.wRook:
    case pieceValues.wBishop:
    case pieceValues.wKnight:
    case pieceValues.wPawn:
      return true;
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