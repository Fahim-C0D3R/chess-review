import { Chess } from 'chess.js';

export function parsePgn(pgn: string): GameData {
  const chess = new Chess();
  chess.loadPgn(pgn);
  
  return {
    pgn,
    moves: chess.history(),
    fen: chess.fen(),
    result: chess.header('Result'),
    white: chess.header('White'),
    black: chess.header('Black')
  };
}

export function getOpeningName(fen: string): string {
  // Simplified opening detection - in a real app you'd use a proper opening book
  const moves = new Chess(fen).history();
  if (moves.length < 3) return 'Starting Position';
  
  const firstMoves = moves.slice(0, 3).join(' ');
  
  if (firstMoves.includes('e4 e5 Nf3 Nc6 Bb5')) return 'Ruy Lopez';
  if (firstMoves.includes('e4 c5')) return 'Sicilian Defense';
  if (firstMoves.includes('d4 d5')) return 'Queen\'s Gambit';
  if (firstMoves.includes('e4 e5 Nf3 Nf6')) return 'Petrov\'s Defense';
  
  return 'Unknown Opening';
}

export function classifyMove(
  beforeEval: number,
  afterEval: number,
  bestMoveEval: number,
  isPlayerTurn: boolean
): MoveAnalysis['classification'] {
  const centipawnLoss = Math.abs(bestMoveEval - afterEval) * 100;
  
  if (centipawnLoss > 300) return 'blunder';
  if (centipawnLoss > 150) return 'mistake';
  if (centipawnLoss > 50) return 'inaccuracy';
  
  // Only classify good/great/brilliant for player's moves
  if (!isPlayerTurn) return 'good';
  
  if (centipawnLoss < 10 && Math.abs(afterEval - beforeEval) > 1.5) return 'brilliant';
  if (centipawnLoss < 20) return 'great';
  
  return 'good';
}
