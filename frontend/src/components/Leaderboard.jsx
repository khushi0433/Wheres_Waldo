import React from 'react';

const Leaderboard = ({ scores, photoTitle, onClose }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-lg">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Leaderboard</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          )}
        </div>
        
        {photoTitle && (
          <p className="text-lg text-gray-600 mb-6 text-center">{photoTitle}</p>
        )}

        {scores && scores.length > 0 ? (
          <div className="space-y-3">
            {scores.slice(0, 10).map((score, index) => (
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
                  {index === 0 ? 'number one' : index === 1 ? 'number two' : index === 2 ? 'number 3' : `#${index + 1}`}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{score.playerName}</div>
                  <div className="text-sm opacity-75">
                    {new Date(score.completedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl font-mono">
                    {formatTime(score.durationMs)}
                  </div>
                  <div className="text-sm opacity-75">
                    {score.attempts} attempts
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏁</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No scores yet!</h3>
            <p className="text-gray-500">Be the first to complete this photo and set a record!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
