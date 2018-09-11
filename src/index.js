import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SortButton from './sort-button/index.js';

function Square(props) {
  const winPos = props.winPosition;
  let cssName;
  if ((winPos[0] === props.pos) || 
      (winPos[1] === props.pos) || 
      (winPos[2] === props.pos)) {
    cssName="highlight-square";
  } else {
    cssName="square";
  }
  return (
    <button 
      className={cssName}
      onClick={props.onClick}>
        {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
          <Square
              winPosition={this.props.winPosition}
              value={this.props.squares[i]}
              pos={i}
              onClick={() => this.props.onClick(i)}
          />
    );
  }

  renderboard = () => {
    let row = [];
    for (let i=0; i < 9; i+=3) {
        let column = [];
        for (let j=0; j < 3; j++) {
          column.push(this.renderSquare(i+j))
        }
        row.push(<div className="board-row">{column}</div>)
    }
    return row;
  }

  render() {
    return (
      <div>
        {this.renderboard()}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortBy: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).player || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  sortClick() {
    this.setState({
      sortBy: !this.state.sortBy,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const sorted = this.state.sortBy;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';    
        return (
          <li key={move}>
            <button 
              onClick={() => this.jumpTo(move)}
              className={ this.state.stepNumber === move ? 'selected-step' : null }
            >
              {desc} : position 
            </button>
          </li>
        )
    });

    let status;
    if (history.length === 10) {
      status = "Draw!";
    } else if (winner.player) {
      status = 'Winner: ' + winner.player;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winPosition = {winner.winPosition}
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <SortButton
              sortBy = {sorted}
              onSortClick = {() => this.sortClick()}
            />
          </div>
          <ol>{sorted ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    console.log("a:" + a + " b: " + b + " c: " +c);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log('Squares[a]:' + squares[a]);
      return { player: squares[a], winPosition: [a, b, c]};
    }
  }
  return {player: null, winPosition: [null,null,null]};
}
  

// ========================================

ReactDOM.render(
  <div className="container">
    <Game />
  </div>,
  document.getElementById('root')
);
