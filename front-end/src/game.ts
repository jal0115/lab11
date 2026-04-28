interface GameState {
  cells: Cell[];
  currentPlayer: string;
  winner: string | null;
  gameOver: boolean;
}

interface Cell {
  text: string;
  playable: boolean;
  x: number;
  y: number;
}

export type { GameState, Cell }
