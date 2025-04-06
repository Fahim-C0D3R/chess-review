// src/components/GameSummary.jsx
import React from 'react';

const GameSummary = ({ analysis, onStartReview }) => {
  if (!analysis) return <div>Load a PGN to see the summary</div>;

  const { whiteRating, blackRating, phaseRatings, moveStats } = analysis;

  return (
    <div className="game-summary">
      <h2>Game Rating</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>{whiteRating}</div>
        <div>{blackRating}</div>
      </div>
      <div>
        <h3>Opening</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>{phaseRatings.white.opening.icon}</span>
          <span>{phaseRatings.black.opening.icon}</span>
        </div>
      </div>
      <div>
        <h3>Middlegame</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>{phaseRatings.white.middlegame.icon}</span>
          <span>{phaseRatings.black.middlegame.icon}</span>
        </div>
      </div>
      <div>
        <h3>Endgame</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>{phaseRatings.white.endgame.icon || '-'}</span>
          <span>{phaseRatings.black.endgame.icon || '-'}</span>
        </div>
      </div>
      <div style={{ margin: '20px 0' }}>
        <span>⚡ 3 min</span>
      </div>
      <button className="green-button" onClick={onStartReview}>
        Start Review
      </button>
    </div>
  );
};

export default GameSummary;
