import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Gameboard from './components/Gameboard';
import PhotoSelector from './components/PhotoSelector';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import apiService from './services/api';

function App() {
  const [gameState, setGameState] = useState('selecting'); // selecting, loading, playing, completed
  const [photoData, setPhotoData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const initializeGame = async (photoId) => {
    try {
      console.log('Initializing game with photoId:', photoId);
      setError(null);
      setGameState('loading');
      
      const data = await apiService.createSession(photoId);
      console.log('Session created successfully:', data);
      setPhotoData(data.photo);
      setSessionId(data.sessionId);
      setGameState('playing');
    } catch (err) {
      console.error('Error initializing game:', err);
      setError('Failed to start game. Please refresh the page.');
      setGameState('error');
    }
  };

  const handlePhotoSelect = (photo) => {
    initializeGame(photo.id);
  };

  const handleGameComplete = async (gameTime) => {
    setGameState('completed');
    
    // Load leaderboard for this photo
    try {
      const data = await apiService.getLeaderboard(photoData.id);
      setLeaderboard(data.scores || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  const handleRestartGame = () => {
    setGameState('selecting');
    setPhotoData(null);
    setSessionId(null);
    setError(null);
    setLeaderboard([]);
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
          <h2 className="text-2xl font-light m-0">Loading Game...</h2>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white text-center p-5">
          <h2 className="text-3xl font-bold mb-4 m-0">Oops! Something went wrong</h2>
          <p className="text-lg opacity-90 mb-8 max-w-md">{error}</p>
          <button 
            onClick={handleRestartGame} 
            className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-white/30 hover:transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans">
        <Routes>
          <Route path="/" element={
            <div>
              <header className="text-center py-8 px-5 text-white">
                <h1 className="text-5xl font-bold mb-3 text-shadow-lg">🔍 Where's Waldo Game</h1>
                <p className="text-xl opacity-90 font-light">Click on the image to find the hidden characters!</p>
              </header>
              <PhotoSelector onPhotoSelect={handlePhotoSelect} />
            </div>
          } />
          <Route path="/game" element={<GamePage />} />
          <Route path="/game/:photoId" element={<GamePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/leaderboard/:photoId" element={<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
