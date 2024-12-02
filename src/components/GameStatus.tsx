import React from 'react';
import { GamePhase, GAME_PHASES } from '../config/constants';

interface GameStatusProps {
  currentPhase: GamePhase;
  timeLeft: number;
  message: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({ currentPhase, timeLeft, message }) => {
  const getPhaseDisplay = () => {
    switch (currentPhase) {
      case GAME_PHASES.STAKING:
        return 'Staking Phase';
      case GAME_PHASES.GAMEPLAY:
        return 'Gameplay Phase';
      case GAME_PHASES.WINNER_DECLARATION:
        return 'Winner Declaration';
      default:
        return 'Unknown Phase';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-neon-blue glow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-neon-pink font-bold text-lg">{getPhaseDisplay()}</h3>
        <span className="text-neon-green font-mono">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <p className="text-neon-blue text-sm">{message}</p>
    </div>
  );
};