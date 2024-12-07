import React from 'react';
import { Target } from './Target';
import { GAME_PHASES, GamePhase } from '../config/constants';
import { Position } from '../types';

interface GameAreaProps {
  currentPhase: GamePhase;
  targetPosition: Position;
  isStaked: boolean;
  onTargetClick: () => void;
}

export const GameArea: React.FC<GameAreaProps> = ({
  currentPhase,
  targetPosition,
  isStaked,
  onTargetClick,
}) => {
  return (
    <div className="relative aspect-[21/9] bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-neon-blue glow-md mt-4 h-[70vh]">
      {currentPhase === GAME_PHASES.GAMEPLAY && (
        <Target 
          position={targetPosition} 
          onClick={onTargetClick}
          isInteractive={isStaked}
        />
      )}
      
      {currentPhase === GAME_PHASES.GAMEPLAY && !isStaked && (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-lg p-4">
          <p className="text-neon-pink">Spectating mode - Stake SOL to play</p>
        </div>
      )}
    </div>
  );
};