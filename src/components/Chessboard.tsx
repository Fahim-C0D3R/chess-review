import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { GameData, GameAnalysis } from '../types/types';
import MoveClassification from './MoveClassification';

interface ChessboardProps {
  gameData: GameData;
  currentMove: number;
  onMoveChange: (move: number) => void;
  analysis?: GameAnalysis;
}

export default function ChessboardComponent({ 
  gameData, 
  currentMove, 
  onMoveChange,
  analysis
}: ChessboardProps) {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  useEffect(() => {
    const newGame = gameData.fen ? new Chess(gameData.fen) : new Chess();
    const moves: string[] = [];
    
    for (const move of gameData.moves) {
      try {
        newGame.move(move);
        moves.push(move);
      } catch (e) {
        console.error('Invalid move:', move);
      }
    }
    
    setGame(newGame);
    setMoveHistory(moves);
  }, [gameData]);

  const goToMove = (moveIndex: number) => {
    const tempGame = gameData.fen ? new Chess(gameData.fen) : new Chess();
    
    for (let i = 0; i < moveIndex && i < moveHistory.length; i++) {
      tempGame.move(moveHistory[i]);
    }
    
    setGame(tempGame);
    onMoveChange(moveIndex);
  };

  const getMoveClass = (moveIndex: number) => {
    if (!analysis || moveIndex >= analysis.moves.length) return '';
    return analysis.moves[moveIndex].classification;
  };

  return (
    <div className="chessboard-container">
      <Chessboard 
        position={game.fen()} 
        boardWidth={500}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}
      />
      
      <div className="move-history">
        {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
          const whiteMove = moveHistory[i * 2];
          const blackMove = moveHistory[i * 2 + 1];
          
          return (
            <div key={i} className="move-pair">
              <button 
                onClick={() => goToMove(i * 2 + 1)}
                className={`${currentMove === i * 2 + 1 ? 'active' : ''} ${getMoveClass(i * 2)}`}
              >
                {i + 1}. {whiteMove}
                {analysis && <MoveClassification classification={analysis.moves[i * 2].classification} />}
              </button>
              
              {blackMove && (
                <button 
                  onClick={() => goToMove(i * 2 + 2)}
                  className={`${currentMove === i * 2 + 2 ? 'active' : ''} ${getMoveClass(i * 2 + 1)}`}
                >
                  {i + 1}... {blackMove}
                  {analysis && <MoveClassification classification={analysis.moves[i * 2 + 1].classification} />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
