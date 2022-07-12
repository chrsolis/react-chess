import React from 'react';
import '../css/InfoBoard.css';

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

class InfoBoard extends React.Component {
    renderInfo(i, r) {
        if (i % 2 === 0) {
            return (
                <div className="info">
                    <span className='info-num'>{r}</span> {getPieceDescription(this.props.history[i].pieceMoved, this.props.history[i].pieceTaken)}
                </div>
            )
        }
        return (
            <div className="info info-second">
                {getPieceDescription(this.props.history[i].pieceMoved, this.props.history[i].pieceTaken)}
            </div>
        )
    }

    renderRow(row) {
        const moves = [];
        const offset = row * 2;
        let maxInRow = ((this.props.history.length - offset) % 2 === 0) ? 2 : 1;
        if (this.props.history.length - offset > 1) {
            maxInRow = 2;
        }
        for (let s = 0; s < maxInRow; s++) {
            moves.push(this.renderInfo(offset + s, row));
        }
        return (
            <div className='info-board-row'>
                {moves}
            </div>
        );
    }

    render() {
        const rows = [];
        const cols = Math.ceil((this.props.history.length) / 2);
        for (let r = 0; r < cols; r++) {
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

function getPieceDescription(pieceMoved, pieceTaken) {
    let returnString = getPieceAbbreviation(pieceMoved.value);
    if (pieceTaken.value !== null) {
        returnString += 'x';
    }
    returnString += getLocationReference(pieceTaken.location);
    return returnString;
}
function getLocationReference(location) {
    const numValue = Math.abs((Math.floor(location / 8)) - 8);
    const letterVal = (location % 8);
    let ref;
    switch (letterVal) {
        case 0:
            ref = 'a';
            break;
        case 1:
            ref = 'b';
            break;
        case 2:
            ref = 'c';
            break;
        case 3:
            ref = 'd';
            break;
        case 4:
            ref = 'e';
            break;
        case 5:
            ref = 'f';
            break;
        case 6:
            ref = 'g';
            break;
        case 7:
            ref = 'h';
            break;
    }
    ref += numValue;
    return ref;
}
function getPieceAbbreviation(pieceValue) {
    switch (pieceValue) {
        case pieceValues.wKing:
        case pieceValues.bKing:
            return 'K';
        case pieceValues.wQueen:
        case pieceValues.bQueen:
            return 'Q';
        case pieceValues.wRook:
        case pieceValues.bRook:
            return 'R';
        case pieceValues.wBishop:
        case pieceValues.bBishop:
            return 'B';
        case pieceValues.wKnight:
        case pieceValues.bKnight:
            return 'N';
        default:
            return '';
    }
}

export default InfoBoard;