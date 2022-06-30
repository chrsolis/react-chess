import React from 'react';
import '../css/square.css';

function Square(props) {
  let sqClass = "square";
  if (Math.floor(props.location/8)%2 === 0) {
    if (props.location%2 === 0) {
      sqClass += " white";
    } else {
      sqClass += " black";
    }
  } else {
    if (props.location%2 === 0) {
      sqClass += " black";
    } else {
      sqClass += " white";
    }
  }
  return (
    <button className={sqClass} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

export default Square;