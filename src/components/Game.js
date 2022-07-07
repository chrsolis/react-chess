import React from 'react';
import Board from './Board';
import '../css/game.css';

const amtOfRows = 8;
const amtOfCols = 8;
const totalSquares = amtOfRows * amtOfCols;

let hasRightBRookMoved, hasLeftBRookMoved, hasRightWRookMoved, hasLeftWRookMoved = false;
let hasBKingMoved, hasWKingMoved = false;
let castle = false;

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
    } else if (isTurn(this.state.whiteTurn, this.state.selectedPiece.value) && this.isValidMove(this.state.selectedPiece, i, squares)) {
      squares[i] = this.state.selectedPiece.value;
      squares[this.state.selectedPiece.location] = null;

      if (this.state.selectedPiece.value === pieceValues.bRook || this.state.selectedPiece.value === pieceValues.wRook) {
        updateRookMoveStatus(this.state.selectedPiece);
      }
      if (this.state.selectedPiece.value === pieceValues.bKing || this.state.selectedPiece.value === pieceValues.wKing) {
        updateKingMoveStatus();
      }
      if (castle) {
        this.castle(i, squares);
      }

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

  isValidMove(piece, destination, squares) {
    if (piece.location === null || piece.location === destination || piece.value === null) {
      return false;
    }
    if (squares[destination] !== null && isWhite(squares[destination]) === isWhite(piece.value)) {
      return false;
    }
    switch (piece.value) {
      case pieceValues.wKing:
      case pieceValues.bKing:
        return this.isValidKingMove(destination, piece);
      case pieceValues.wQueen:
      case pieceValues.bQueen:
        return this.isValidQueenMove(destination, piece.location);
      case pieceValues.wRook:
      case pieceValues.bRook:
        return this.isValidRookMove(destination, piece.location);
      case pieceValues.wBishop:
      case pieceValues.bBishop:
        return this.isValidBishopMove(destination, piece.location, squares);
      case pieceValues.wKnight:
      case pieceValues.bKnight:
        return this.isValidKnightMove(destination, piece.location);
      case pieceValues.wPawn:
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
  // utility functions for valid move checks
  isValidKnightMove(destination, pLocation) {
    // Valid positions a knight can move based on board index
    if (destination === (pLocation + 6) || destination === (pLocation - 6)) {
      return true;
    }
    if (destination === (pLocation + 10) || destination === (pLocation - 10)) {
      return true;
    }
    if (destination === (pLocation + 15) || destination === (pLocation - 15)) {
      return true;
    }
    if (destination === (pLocation + 17) || destination === (pLocation - 17)) {
      return true;
    }
    return false;
  }
  isValidBishopMove(destination, pLocation, squares) {
    let offset = 7;
    let i = 1;
    let isValidDestination = false;
    while (offset <= 56) {
      const lOffset = 9 * i;
      const rOffset = 7 * i;
      if (destination === (pLocation + rOffset) || destination === (pLocation - rOffset)) {
        isValidDestination = true;
        break;
      }
      if (destination === (pLocation + lOffset) || destination === (pLocation - lOffset)) {
        isValidDestination = true;
        break;
      }
      offset = rOffset + ++i;
    }
    if (isValidDestination && this.isBishopDiagonalClear(pLocation, destination, squares)) {
      return true;
    }
    return false;
  }
  isValidRookMove(destination, pLocation) {
    let offset = 8;
    while (pLocation + offset <= 63 || pLocation - offset >= 0) {
      if (destination === (pLocation + offset) || destination === (pLocation - offset)) {
        return true;
      }
      offset += 8;
    }
    let cStart = getColumnIndex(pLocation) * 8;
    let cEnd = cStart + 7;
    offset = 0;
    while (pLocation + offset <= cEnd || pLocation - offset >= cStart) {
      if (destination === (pLocation + offset) || destination === (pLocation - offset)) {
        // TODO: fix
        return true;
      }
      offset++;
    }
    return false;
  }
  isValidQueenMove(destination, pLocation) {
    if (this.isValidBishopMove(destination, pLocation) || this.isValidRookMove(destination, pLocation)) {
      return true;
    }
    return false;
  }
  isValidKingMove(destination, piece) {
    const history = this.state.history.slice(0, this.state.turnNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let pLocation = piece.location;

    if (destination === (pLocation + 8) || destination === (pLocation - 8)) return true;
    if (destination === (pLocation + 1) || destination === (pLocation - 1)) return true;
    if (destination === (pLocation + 9) || destination === (pLocation - 9)) return true;
    if (destination === (pLocation + 7) || destination === (pLocation - 7)) return true;

    if (piece.value === pieceValues.wKing && !hasWKingMoved) {
      if ((destination === (pLocation - 2) && !hasLeftWRookMoved) && squares[59] === null && squares[57] === null) {
        castle = true;
        return true;
      }
      if ((destination === (pLocation + 2) && !hasRightWRookMoved) && squares[61] === null) {
        castle = true;
        return true;
      }
    }
    if (piece.value === pieceValues.bKing && !hasBKingMoved) {
      if ((destination === (pLocation - 2) && !hasLeftBRookMoved) && squares[3] === null && squares[1] === null) {
        castle = true;
        return true;
      }
      if ((destination === (pLocation + 2) && !hasRightBRookMoved) && squares[5] === null) {
        castle = true;
        return true;
      }
    }

    return false;
  }

  isBishopDiagonalClear(origin, destination, squares) {
    // figure out whether it is to the left of the origin, or to the right.
    let difference = origin - destination;
    let offset;
    if (difference > 0) {
      if (difference % 7 === 0) {
        // to the right and above the origin
        offset = -7;
      } else {
        offset = -9;
      }
    } else {
      if (difference % 7 === 0) {
        // to the left and below the origin
        offset = 7;
      } else {
        offset = 9;
      }
    }
    let i = offset;
    while (origin + i !== destination) {
      if (squares[origin + i] !== null) {
        return false;
      }
      i += offset;
    }
    return true;
  }
  isRookLineClear(origin, destination, squares) {

  }

  castle(destination, squares) {
    switch (destination) {
      case 2:
      case 58:
        if (isWhite(this.state.selectedPiece.value)) {
          squares[destination + 1] = pieceValues.wRook;
          squares[56] = null;
        } else {
          squares[destination + 1] = pieceValues.bRook;
          squares[0] = null;
        }
        break;
      case 6:
      case 62:
        if (isWhite(this.state.selectedPiece.value)) {
          squares[destination - 1] = pieceValues.wRook;
          squares[63] = null;
        } else {
          squares[destination - 1] = pieceValues.bRook;
          squares[7] = null;
        }
        break;
    }
    castle = false;
    return squares;
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

function getColumnIndex(index) {
  return Math.floor(index / 8);
}

function updateRookMoveStatus(piece) {
  if (!hasLeftWRookMoved && piece.value === pieceValues.wRook && piece.location === 56) {
    hasLeftWRookMoved = true;
  } else if (!hasRightWRookMoved && piece.value === pieceValues.wRook && piece.location === 63) {
    hasRightWRookMoved = true;
  } else if (!hasLeftBRookMoved && piece.value === pieceValues.bRook && piece.location === 0) {
    hasLeftBRookMoved = true;
  } else if (!hasRightBRookMoved && piece.value === pieceValues.bRook && piece.location === 7) {
    hasRightBRookMoved = true;
  }
}
function updateKingMoveStatus() {
  if (!hasWKingMoved) {
    hasWKingMoved = true;
  } else if (!hasBKingMoved) {
    hasBKingMoved = true;
  }
}

export default Game;