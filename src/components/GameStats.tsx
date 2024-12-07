import React from 'react';
import { formatTime } from '../utils/time';

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
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
        Game Stats
      </h2>
      <div className="space-y-4">
        <div className="bg-black/20 rounded-lg p-4">
          <h3 className="text-sm text-cyan-300 mb-1">Players</h3>
          <p className="text-2xl font-bold text-white">{playerCount}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <h3 className="text-sm text-cyan-300 mb-1">Time Left</h3>
          <p className="text-2xl font-bold text-white font-mono">
            {formatTime(timeLeft)}
          </p>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <h3 className="text-sm text-cyan-300 mb-1">Prize Pool</h3>
          <p className="text-2xl font-bold text-white">{prizePool.toFixed(2)} SOL</p>
        </div>
      </div>
    </div>
  );
};