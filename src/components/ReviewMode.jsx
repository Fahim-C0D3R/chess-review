// src/components/ReviewMode.jsx
import React from 'react';
import Chart from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const ReviewMode = ({ moves, analysis, onMoveClick, currentMoveIndex }) => {
  if (!analysis) return null;

  const { moves: analyzedMoves, accuracy, moveStats } = analysis;

  const chartData = {
    labels: moves.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Evaluation',
        data: analyzedMoves.map((m) => m.score),
        borderColor: '#76B900',
        fill: false,
      },
    ],
  };

  return (
    <div className="review-mode">
      <h2>Game Review</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Accuracy: {accuracy.white}</div>
        <div>Accuracy: {accuracy.black}</div>
      </div>
      <div>
        <h3>Move Stats</h3>
        <table>
          <tr>
            <td>Brilliant</td>
            <td>{moveStats.white.brilliant}</td>
            <td>{moveStats.black.brilliant}</td>
          </tr>
          <tr>
            <td>Mistake</td>
            <td>{moveStats.white.mistake}</td>
            <td>{moveStats.black.mistake}</td>
          </tr>
          <tr>
            <td>Blunder</td>
            <td>{moveStats.white.blunder}</td>
            <td>{moveStats.black.blunder}</td>
          </tr>
        </table>
      </div>
      <Chart type="line" data={chartData} />
      <h3>Moves</h3>
      <div>
        {moves.map((move, i) => (
          <span
            key={i}
            onClick={() => onMoveClick(i)}
            style={{ cursor: 'pointer', color: i === currentMoveIndex ? '#76B900' : 'white' }}
          >
            {move} {analyzedMoves[i]?.annotation && `(${analyzedMoves[i].annotation})`}{' '}
          </span>
        ))}
      </div>
      {analyzedMoves[currentMoveIndex]?.annotation === 'Mistake' && (
        <div className="feedback">
          <h4>{move} is a mistake</h4>
          <p>{analyzedMoves[currentMoveIndex].feedback}</p>
          <button className="green-button">Next</button>
        </div>
      )}
    </div>
  );
};

export default ReviewMode;
