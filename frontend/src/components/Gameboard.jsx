import React, { useState } from "react";

export default function GameBoard() {
  // generate a random number between 1 and 100
  const [secretNumber, setSecretNumber] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    if (!guess) return;

    const numGuess = parseInt(guess, 10);
    setAttempts((prev) => prev + 1);

    if (numGuess === secretNumber) {
      setMessage(`🎉 Correct! The number was ${secretNumber}.`);
    } else if (numGuess < secretNumber) {
      setMessage("📉 Too low! Try again.");
    } else {
      setMessage("📈 Too high! Try again.");
    }

    setGuess("");
  };

  const resetGame = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("");
    setAttempts(0);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-darkOrange">Guess the Number 🎲</h2>

      <p className="mb-4 text-gray-700">
        I’m thinking of a number between <span className="font-semibold">1</span> and{" "}
        <span className="font-semibold">100</span>. Can you guess it?
      </p>

      <div className="flex gap-2 justify-center mb-4">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="w-28 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-darkOrange"
          placeholder="Enter guess"
        />
        <button
          onClick={handleGuess}
          className="bg-darkOrange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Submit
        </button>
      </div>

      {message && (
        <p
          className={`mb-3 font-medium ${
            message.includes("Correct") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-sm text-gray-500 mb-3">Attempts: {attempts}</p>

      <button
        onClick={resetGame}
        className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        🔄 Reset Game
      </button>
    </div>
  );
}
