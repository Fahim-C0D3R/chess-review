import { StockfishWrapper } from './stockfishWrapper';
import { Chess } from 'chess.js';
import { GameData, GameAnalysis, MoveAnalysis } from '../types/types';
import { getOpeningName, classifyMove } from './chessUtils';

export async function analyzeGame(gameData: GameData): Promise<GameAnalysis> {
  const stockfish = new StockfishWrapper();
  const chess = new Chess(gameData.fen);
  const analysis: MoveAnalysis[] = [];
  
  let whiteAccuracySum = 0;
  let blackAccuracySum = 0;
  let blunderCount = 0;
  let mistakeCount = 0;
  let inaccuracyCount = 0;
  
  for (let i = 0; i < gameData.moves.length; i++) {
    const move = gameData.moves[i];
    const fenBefore = chess.fen();
    const isWhiteTurn = chess.turn() === 'w';
    
    // Get evaluation before move
    const beforeEval = await stockfish.getEvaluation(fenBefore);
    
    // Get best move and its evaluation
    const bestMove = await stockfish.getBestMove(fenBefore);
    chess.move(bestMove);
    const bestMoveEval = await stockfish.getEvaluation(chess.fen());
    chess.undo();
    
    // Make the actual move
    chess.move(move);
    const fenAfter = chess.fen();
    const afterEval = await stockfish.getEvaluation(fenAfter);
    
    // Calculate accuracy and classify move
    const accuracy = calculateMoveAccuracy(beforeEval, afterEval, bestMoveEval);
    const classification = classifyMove(beforeEval, afterEval, bestMoveEval, isWhiteTurn);
    const centipawnLoss = Math.abs(bestMoveEval - afterEval) * 100;
    
    // Update statistics
    if (isWhiteTurn) whiteAccuracySum += accuracy;
    else blackAccuracySum += accuracy;
    
    if (classification === 'blunder') blunderCount++;
    if (classification === 'mistake') mistakeCount++;
    if (classification === 'inaccuracy') inaccuracyCount++;
    
    analysis.push({
      moveNumber: i + 1,
      move,
      fen: fenAfter,
      beforeEval,
      afterEval,
      accuracy,
      bestMove,
      bestMoveEval,
      classification,
      centipawnLoss
    });
  }
  
  stockfish.terminate();
  
  const whiteAccuracy = whiteAccuracySum / Math.ceil(gameData.moves.length / 2);
  const blackAccuracy = blackAccuracySum / Math.floor(gameData.moves.length / 2);
  const averageAccuracy = (whiteAccuracy + blackAccuracy) / 2;
  
  return {
    moves: analysis,
    whiteAccuracy,
    blackAccuracy,
    averageAccuracy,
    blunderCount,
    mistakeCount,
    inaccuracyCount,
    opening: getOpeningName(gameData.fen || 'startpos')
  };
}

function calculateMoveAccuracy(
  beforeEval: number,
  afterEval: number,
  bestMoveEval: number
): number {
  const maxPossible = Math.abs(beforeEval - bestMoveEval);
  const actual = Math.abs(beforeEval - afterEval);
  
  if (maxPossible < 0.1) return 100; // No better move available
  
  const ratio = actual / maxPossible;
  return Math.max(0, 100 - (ratio * 100));
}
