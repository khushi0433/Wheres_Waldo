import React from 'react';

const GuessPopup = ({ 
  clickPosition, 
  characters, 
  foundCharacters, 
  onCharacterSelect, 
  onClose, 
  loading, 
  error 
}) => {
  if (!clickPosition || !characters) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-11/12 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-5">Select a character:</h3>
        
        <div className="grid gap-3 mb-5">
          {characters
            .filter(char => !foundCharacters.includes(char.id))
            .map(character => (
              <button
                key={character.id}
                onClick={() => onCharacterSelect(character)}
                disabled={loading}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-300 capitalize hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {character.name}
              </button>
            ))}
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-md mt-3 border-l-4 border-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-blue-600 italic mt-3 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Checking...
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GuessPopup;
