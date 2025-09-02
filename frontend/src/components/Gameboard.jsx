import React, { useState, useEffect, useRef } from "react";
import apiService from "../services/api";
import GuessPopup from "./guessPopup";

const Gameboard = ({ photoData, onGameComplete }) => {
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  // Initialize game timer when component mounts
  useEffect(() => {
    setGameStartTime(Date.now());
  }, []);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setClickPosition(null);
        setSelectedCharacter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Normalize coordinates for different screen sizes
  const normalizeCoordinates = (clientX, clientY) => {
    if (!imageRef.current) return { x: 0, y: 0 };

    const rect = imageRef.current.getBoundingClientRect();
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Calculate normalized coordinates (0-1 range)
    const normalizedX = (clientX - rect.left) / displayWidth;
    const normalizedY = (clientY - rect.top) / displayHeight;

    // Convert to image coordinates
    const imageX = normalizedX * imageWidth;
    const imageY = normalizedY * imageHeight;

    return { x: imageX, y: imageY };
  };

  const handleImageClick = (event) => {
    const { clientX, clientY } = event;
    const normalizedCoords = normalizeCoordinates(clientX, clientY);
    
    setClickPosition({
      x: clientX,
      y: clientY,
      normalizedX: normalizedCoords.x,
      normalizedY: normalizedCoords.y
    });
    setSelectedCharacter(null);
    setError(null);
  };

  const handleCharacterSelect = async (character) => {
    if (!clickPosition || !photoData) return;

    setSelectedCharacter(character);
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.submitGuess(
        character.id,
        clickPosition.normalizedX,
        clickPosition.normalizedY
      );

      if (result.isCorrect) {
        setFoundCharacters(prev => [...prev, character.id]);
        
        // Check if all characters are found
        if (foundCharacters.length + 1 >= photoData.totalCharacters) {
          const gameTime = Date.now() - gameStartTime;
          setGameCompleted(true);
          setShowNameModal(true);
          onGameComplete && onGameComplete(gameTime);
        }
      } else {
        setError("Wrong location! Try again.");
      }
    } catch (err) {
      setError("Failed to submit guess. Please try again.");
    } finally {
      setLoading(false);
      setClickPosition(null);
      setSelectedCharacter(null);
    }
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return;

    try {
      const result = await apiService.completeGame(playerName.trim());
      setShowNameModal(false);
      // Handle success (maybe show leaderboard)
    } catch (err) {
      setError("Failed to submit score. Please try again.");
    }
  };

  const getGameTime = () => {
    if (!gameStartTime) return 0;
    return Math.floor((Date.now() - gameStartTime) / 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      <div className="flex justify-between items-center mb-5 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold m-0">{photoData?.title || "Find the Characters!"}</h2>
        <div className="flex gap-5 text-lg font-medium">
          <span className="bg-white/20 px-3 py-2 rounded-md backdrop-blur-sm">Found: {foundCharacters.length}/{photoData?.totalCharacters || 0}</span>
          <span className="bg-white/20 px-3 py-2 rounded-md backdrop-blur-sm">Time: {formatTime(getGameTime())}</span>
        </div>
      </div>

      <div className="relative inline-block rounded-lg overflow-hidden shadow-2xl bg-white">
        <img
          ref={imageRef}
          src={photoData?.imageUrl}
          alt={photoData?.title}
          onClick={handleImageClick}
          className="block max-w-full h-auto cursor-crosshair transition-transform duration-200 hover:scale-[1.02]"
        />
        
        {/* Found character markers */}
        {foundCharacters.map(characterId => {
          const character = photoData?.characters?.find(c => c.id === characterId);
          if (!character) return null;
          
          return (
            <div
              key={characterId}
              className="absolute w-8 h-8 bg-green-500 text-white border-3 border-white rounded-full flex items-center justify-center font-bold text-base pointer-events-none z-10 shadow-lg"
              style={{
                left: `${(character.boxX + character.boxW / 2) * 100}%`,
                top: `${(character.boxY + character.boxH / 2) * 100}%`
              }}
            >
              ✓
      </div>
          );
        })}

        {/* Click position marker */}
        {clickPosition && (
          <div
            className="absolute w-5 h-5 bg-red-500 border-3 border-white rounded-full pointer-events-none z-20 animate-pulse"
            style={{
              left: clickPosition.x,
              top: clickPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </div>

      {/* Character selection modal */}
      <GuessPopup
        clickPosition={clickPosition}
        characters={photoData?.characters}
        foundCharacters={foundCharacters}
        onCharacterSelect={handleCharacterSelect}
        onClose={() => {
          setClickPosition(null);
          setSelectedCharacter(null);
        }}
        loading={loading}
        error={error}
      />

      {/* Name input modal for high score */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-lg">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
            <h3 className="text-4xl font-bold mb-3">Congratulations!</h3>
            <p className="text-xl mb-6 opacity-90">You found all characters in {formatTime(getGameTime())}</p>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={50}
              className="w-full p-4 border-none rounded-xl text-lg mb-5 bg-white/90 text-gray-800 text-center focus:outline-none focus:bg-white focus:ring-4 focus:ring-white/30"
            />
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleSubmitScore} 
                disabled={!playerName.trim()}
                className="px-6 py-3 bg-green-500 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-300 min-w-32 hover:bg-teal-400 hover:transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Submit Score
              </button>
      <button
                onClick={() => setShowNameModal(false)}
                className="px-6 py-3 bg-white/20 text-white border-2 border-white/30 rounded-lg text-base font-medium cursor-pointer transition-all duration-300 min-w-32 hover:bg-white/30"
      >
                Skip
      </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gameboard;
