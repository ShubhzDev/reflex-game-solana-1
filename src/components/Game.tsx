import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { GameStats } from './GameStats';
import { StakedPlayers } from './StakedPlayers';
import { GameStatus } from './GameStatus';
import { LegalDisclaimer } from './LegalDisclaimer';
import { GameArea } from './GameArea';
import { Twitter } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useSolanaGame } from '../hooks/useSolanaGame';
import { GAME_CONFIG } from '../config/constants';

const Game: React.FC = () => {
  const { publicKey } = useWallet();
  const {
    gameState,
    isStaked,
    handleTargetClick,
    connectToGame,
    currentPhase,
    phaseTimeLeft,
    statusMessage
  } = useGameState();

  const {
    handleStake,
    isLoading
  } = useSolanaGame();

  useEffect(() => {
    connectToGame();
  }, [connectToGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white">
      <LegalDisclaimer />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue">
            Solana Reflex Battle
          </h1>
          <WalletMultiButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <GameStatus 
              currentPhase={currentPhase}
              timeLeft={phaseTimeLeft}
              message={statusMessage}
            />

            <GameArea
              currentPhase={currentPhase}
              targetPosition={gameState.targetPosition}
              isStaked={isStaked}
              onTargetClick={handleTargetClick}
              onStake={handleStake}
            />
          </div>

          <div className="lg:col-span-1">
            <GameStats 
              playerCount={gameState.players.length}
              timeLeft={phaseTimeLeft}
              prizePool={gameState.prizePool}
            />
            <StakedPlayers players={gameState.players} />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="https://twitter.com/intent/tweet?text=I'm playing Solana Reflex Battle!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2]/20 border border-[#1DA1F2] rounded-lg hover:bg-[#1DA1F2]/30 transition-all duration-300 glow-sm"
          >
            <Twitter className="w-5 h-5" />
            Share on Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Game;