import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import apiService from '../services/api';

const LeaderboardPage = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [photoTitle, setPhotoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [photoId]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If no photoId, show all-time leaderboard (you'd need to implement this endpoint)
      if (photoId) {
        const data = await apiService.getLeaderboard(photoId);
        setLeaderboard(data.scores || []);
        setPhotoTitle(data.photoTitle || 'Photo Leaderboard');
      } else {
        // For now, show empty state
        setLeaderboard([]);
        setPhotoTitle('All-Time Leaderboard');
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
          <h2 className="text-2xl font-light m-0">Loading Leaderboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white text-center p-5">
          <h2 className="text-3xl font-bold mb-4 m-0">Oops! Something went wrong</h2>
          <p className="text-lg opacity-90 mb-8 max-w-md">{error}</p>
          <div className="flex gap-4">
            <button 
              onClick={loadLeaderboard} 
              className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 backdrop-blur-sm hover:bg-white/30 hover:transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
            <button 
              onClick={handleGoHome} 
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
        <h1 className="text-5xl font-bold mb-3 text-shadow-lg">🏆 Leaderboard</h1>
        <p className="text-xl opacity-90 font-light">See how you rank against other players!</p>
      </header>

      <div className="max-w-4xl mx-auto p-5">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{photoTitle}</h2>
            <div className="flex gap-3">
              <button 
                onClick={handleGoBack}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back
              </button>
              <button 
                onClick={handleGoHome}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Home
              </button>
            </div>
          </div>

          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.slice(0, 20).map((score, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-xl transition-colors duration-200 hover:bg-gray-50 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-800 font-bold shadow-lg' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800 font-bold shadow-md' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold shadow-md' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/50 text-xl font-bold mr-4">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{score.playerName}</div>
                    <div className="text-sm opacity-75">
                      {new Date(score.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl font-mono">
                      {Math.floor(score.durationMs / 1000 / 60)}:{(Math.floor(score.durationMs / 1000) % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm opacity-75">
                      {score.attempts} attempts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏁</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No scores yet!</h3>
              <p className="text-gray-500 mb-6">Be the first to complete this photo and set a record!</p>
              <button 
                onClick={() => navigate('/game')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                Play Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
