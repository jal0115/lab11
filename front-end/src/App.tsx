import React from 'react';
import './App.css';
import { GameState, Cell } from './game';
import BoardCell from './Cell';

interface Props { }

class App extends React.Component<Props, GameState> {
  private initialized: boolean = false;

  constructor(props: Props) {
    super(props)
    this.state = {
      cells: [],
      currentPlayer: 'X',
      winner: null,
      gameOver: false
    }
  }

  newGame = async () => {
    const response = await fetch('/newgame');
    const json = await response.json();
    this.setState({
      cells: json['cells'],
      currentPlayer: json['currentPlayer'],
      winner: json['winner'],
      gameOver: json['gameOver']
    });
  }

  /**
   * Undo функц - backend руу /undo хүсэлт явуулна
   */
  undo = async () => {
    const response = await fetch('/undo');
    const json = await response.json();
    this.setState({
      cells: json['cells'],
      currentPlayer: json['currentPlayer'],
      winner: json['winner'],
      gameOver: json['gameOver']
    });
  }

  play(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      e.preventDefault();
      const response = await fetch(`/play?x=${x}&y=${y}`)
      const json = await response.json();
      this.setState({
        cells: json['cells'],
        currentPlayer: json['currentPlayer'],
        winner: json['winner'],
        gameOver: json['gameOver']
      });
    }
  }

  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playable)
      return (
        <div key={index}>
          <a href='/' onClick={this.play(cell.x, cell.y)}>
            <BoardCell cell={cell}></BoardCell>
          </a>
        </div>
      )
    else
      return (
        <div key={index}><BoardCell cell={cell}></BoardCell></div>
      )
  }

  /**
   * Instructions текстийг тооцоолох
   */
  getInstructions(): string {
    if (this.state.winner === 'Draw') {
      return '🤝 Тоглоом тэнцлээ!';
    }
    if (this.state.winner) {
      return `🎉 Ялагч: Тоглогч ${this.state.winner}`;
    }
    return `Тоглогч ${this.state.currentPlayer}-ийн ээлж`;
  }

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
  return (
    <div>
      <div id="instructions">
        {this.getInstructions()}
      </div>
      <div id="board">
        {this.state.cells.map((cell, i) => this.createCell(cell, i))}
      </div>
      <div id="bottombar">
        <button onClick={this.newGame}>New Game</button>
        <button onClick={this.undo} disabled={this.state.gameOver}>Undo</button>
      </div>
    </div>
  );
}
}

export default App;
