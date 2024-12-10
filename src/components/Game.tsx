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
import { toast } from 'react-hot-toast';
import { GAME_CONFIG } from '../config/constants';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

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

  const onStakeClick = async () => {
    try {
      await handleStake();
    } catch (error) {
      toast.error('Failed to stake. Please try again.');
    }
  };

  const stakeAmount = GAME_CONFIG.STAKE_AMOUNT / LAMPORTS_PER_SOL;
  const rentAmount = GAME_CONFIG.RENT_AMOUNT / LAMPORTS_PER_SOL;
  const totalRequired = GAME_CONFIG.MIN_STAKE_TOTAL / LAMPORTS_PER_SOL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-4">
      <LegalDisclaimer />
      
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            Solana Reflex Battle
          </h1>
          <div className="flex items-center gap-4">
            {!isStaked && publicKey && (
              <button
                onClick={onStakeClick}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-lg font-bold text-white hover:opacity-90 transition-all duration-300 shadow-xl disabled:opacity-50"
                title={`Stake ${stakeAmount} SOL + ${rentAmount} SOL rent`}
              >
                {isLoading ? 'Staking...' : `Stake ${totalRequired} SOL to Play`}
              </button>
            )}
            <WalletMultiButton />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-[300px] space-y-4">
            <GameStats 
              playerCount={gameState.players.length}
              timeLeft={phaseTimeLeft}
              prizePool={gameState.prizePool}
            />
            <StakedPlayers players={gameState.players} />
          </div>

          <div className="flex-1">
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
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href="https://twitter.com/intent/tweet?text=I'm playing Solana Reflex Battle!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] rounded-lg hover:bg-[#1A8CD8] transition-all duration-300 shadow-xl"
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