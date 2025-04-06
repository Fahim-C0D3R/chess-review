// src/App.jsx
import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import MoveList from './components/MoveList';
import GameSummary from './components/GameSummary';
import ReviewMode from './components/ReviewMode';
import { analyzeGame } from './api/analyze';
import './App.css';

const App = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [analysis, setAnalysis] = useState(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const loadPGN = async (pgn) => {
    const chess = new Chess();
    chess.load_pgn(pgn);
    setGame(chess);
    setPosition(chess.fen());
    const result = await analyzeGame(pgn);
    setAnalysis(result);
  };

  const handleMoveNavigation = (index) => {
    const chess = new Chess();
    chess.load_pgn(game.pgn());
    for (let i = 0; i <= index; i++) chess.move(game.history()[i]);
    setPosition(chess.fen());
    setMoveIndex(index);
  };

  return (
    <div className="app">
      <div className="left-panel">
        <Chessboard position={position} />
        <div className="navigation">
          <button onClick={() => handleMoveNavigation(0)}>⏮</button>
          <button onClick={() => handleMoveNavigation(Math.max(0, moveIndex - 1))}>⏴</button>
          <button onClick={() => handleMoveNavigation(Math.min(game.history().length - 1, moveIndex + 1))}>⏵</button>
          <button onClick={() => handleMoveNavigation(game.history().length - 1)}>⏭</button>
        </div>
      </div>
      <div className="right-panel">
        {isReviewMode ? (
          <ReviewMode
            moves={game.history()}
            analysis={analysis}
            onMoveClick={handleMoveNavigation}
            currentMoveIndex={moveIndex}
          />
        ) : (
          <GameSummary
            analysis={analysis}
            onStartReview={() => setIsReviewMode(true)}
          />
        )}
        <textarea
          className="pgn-input"
          placeholder="Paste PGN here"
          onChange={(e) => loadPGN(e.target.value)}
        />
      </div>
    </div>
  );
};

export default App;
