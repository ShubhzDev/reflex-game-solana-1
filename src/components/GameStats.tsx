import React from 'react';

interface GameStatsProps {
  playerCount: number;
  timeLeft: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ playerCount, timeLeft }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm text-gray-400 mb-1">Players</h3>
        <p className="text-2xl font-bold">{playerCount}</p>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm text-gray-400 mb-1">Round Ends In</h3>
        <p className="text-2xl font-bold">{Math.ceil(timeLeft)}s</p>
      </div>
    </div>
  );
};