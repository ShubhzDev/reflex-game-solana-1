import React from 'react';

interface GameStatsProps {
  playerCount: number;
  timeLeft: number;
  prizePool: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  playerCount, 
  timeLeft,
  prizePool 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-neon-blue">
        <h3 className="text-sm text-neon-blue mb-1">Players</h3>
        <p className="text-2xl font-bold text-neon-pink">{playerCount}</p>
      </div>
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-neon-blue">
        <h3 className="text-sm text-neon-blue mb-1">Time Left</h3>
        <p className="text-2xl font-bold text-neon-pink">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </p>
      </div>
      <div className="col-span-2 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-neon-blue">
        <h3 className="text-sm text-neon-blue mb-1">Prize Pool</h3>
        <p className="text-2xl font-bold text-neon-pink">{prizePool.toFixed(2)} SOL</p>
      </div>
    </div>
  );
};