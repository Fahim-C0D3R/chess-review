import { useState } from 'react';
import ChessboardComponent from './components/Chessboard';
import AnalysisPanel from './components/AnalysisPanel';
import GameInput from './components/GameInput';
import SummaryStats from './components/SummaryStats';
import { GameData, GameAnalysis } from './types/types';
import './styles/main.css';

function App() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGameLoaded = (data: GameData) => {
    setGameData(data);
    setAnalysis(null);
    setCurrentMove(0);
    setIsAnalyzing(true);
    
    // In a real app, you'd use Web Workers for this
    import('../lib/analysis').then(({ analyzeGame }) => {
      analyzeGame(data).then(result => {
        setAnalysis(result);
        setIsAnalyzing(false);
        setCurrentMove(1); // Start at first move
      });
    });
  };

  return (
    <div className="chess-review-app">
      <header>
        <h1>Chess Game Review</h1>
        <p>Analyze your chess games like Chess.com</p>
      </header>
      
      <GameInput onGameLoaded={handleGameLoaded} />
      
      {isAnalyzing && (
        <div className="loading">
          <p>Analyzing game... This may take a minute.</p>
          <p>Analyzing {gameData?.moves.length} moves at depth 18.</p>
        </div>
      )}
      
      {gameData && analysis && (
        <div className="analysis-container">
          <ChessboardComponent 
            gameData={gameData} 
            currentMove={currentMove}
            onMoveChange={setCurrentMove}
            analysis={analysis}
          />
          <AnalysisPanel 
            analysis={analysis} 
            currentMove={currentMove}
            gameData={gameData}
          />
        </div>
      )}
      
      {analysis && <SummaryStats analysis={analysis} />}
    </div>
  );
}

export default App;
