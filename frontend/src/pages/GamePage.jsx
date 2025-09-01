import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Gameboard from '../components/Gameboard';
import PhotoSelector from '../components/PhotoSelector';
import Leaderboard from '../components/Leaderboard';
import apiService from '../services/api';

const GamePage = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState('selecting'); // selecting, loading, playing, completed
  const [photoData, setPhotoData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const initializeGame = async (selectedPhotoId) => {
    try {
      setError(null);
      setGameState('loading');
      
      const data = await apiService.createSession(selectedPhotoId);
      setPhotoData(data.photo);
      setSessionId(data.sessionId);
      setGameState('playing');
    } catch (err) {
      console.error('Error creating session:', err);
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

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  // If photoId is provided in URL, auto-select that photo
  useEffect(() => {
    if (photoId && photoId !== 'select') {
      // In a real app, you'd fetch the photo data by ID
      // For now, we'll use the default photo
      const defaultPhoto = {
        id: photoId,
        title: 'Selected Photo',
        imageUrl: 'https://example.com/sample-beach.jpg'
      };
      initializeGame(photoId);
    }
  }, [photoId]);

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
          <div className="flex gap-4">
            <button 
              onClick={handleRestartGame} 
              className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-white/30 hover:transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-white/30 hover:transform hover:-translate-y-0.5"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans">
      <header className="text-center py-8 px-5 text-white">
        <h1 className="text-5xl font-bold mb-3 text-shadow-lg">🔍 Where's Waldo Game</h1>
        <p className="text-xl opacity-90 font-light">Click on the image to find the hidden characters!</p>
      </header>

      {gameState === 'selecting' && (
        <PhotoSelector onPhotoSelect={handlePhotoSelect} />
      )}

      {gameState === 'playing' && photoData && (
        <Gameboard 
          photoData={photoData} 
          onGameComplete={handleGameComplete}
        />
      )}

      {gameState === 'completed' && (
        <div className="flex items-center justify-center min-h-[60vh] p-5">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-2xl w-full">
            <h2 className="text-5xl font-bold mb-3 text-gray-800">🎉 Game Complete!</h2>
            <p className="text-xl mb-8 text-gray-600">You found all the characters!</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleShowLeaderboard} 
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                View Leaderboard
              </button>
              <button 
                onClick={handleRestartGame} 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <Leaderboard 
          scores={leaderboard}
          photoTitle={photoData?.title}
          onClose={handleCloseLeaderboard}
        />
      )}
    </div>
  );
};

export default GamePage;
