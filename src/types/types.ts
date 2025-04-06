export interface MoveAnalysis {
  moveNumber: number;
  move: string;
  fen: string;
  beforeEval: number;
  afterEval: number;
  accuracy: number;
  bestMove: string;
  bestMoveEval: number;
  classification: 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  centipawnLoss: number;
}

export interface GameAnalysis {
  moves: MoveAnalysis[];
  whiteAccuracy: number;
  blackAccuracy: number;
  averageAccuracy: number;
  blunderCount: number;
  mistakeCount: number;
  inaccuracyCount: number;
  opening: string;
}

export interface GameData {
  pgn?: string;
  fen?: string;
  moves: string[];
  result?: string;
  white?: string;
  black?: string;
}
