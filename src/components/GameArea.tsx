import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Target } from './Target';
import { GAME_PHASES, GamePhase } from '../config/constants';

interface GameAreaProps {
  currentPhase: GamePhase;
  targetPosition: { x: number; y: number };
  isStaked: boolean;
  onTargetClick: () => void;
  onStake: () => Promise<void>;
}

export const GameArea: React.FC<GameAreaProps> = ({
  currentPhase,
  targetPosition,
  isStaked,
  onTargetClick,
  onStake,
}) => {
  const { publicKey } = useWallet();

  return (
    <div className="relative aspect-[21/9] bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-neon-blue glow-md mt-4">
      {currentPhase === GAME_PHASES.GAMEPLAY && isStaked && (
        <Target position={targetPosition} onClick={onTargetClick} />
      )}
      
      {!publicKey ? (
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-lg p-4">
          <p className="text-neon-pink">Connect your wallet to play</p>
        </div>
      ) : !isStaked && currentPhase === GAME_PHASES.STAKING ? (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onStake()}
            className="px-6 py-3 bg-neon-pink/20 border border-neon-pink rounded-lg font-bold text-neon-pink hover:bg-neon-pink/30 transition-all duration-300 glow-sm"
          >
            Stake 0.1 SOL to Play
          </button>
        </div>
      ) : null}
    </div>
  );
};