import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Target } from './Target';
import { GameStats } from './GameStats';
import { StakedPlayers } from './StakedPlayers';
import { Twitter } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { Player } from '../types';

const Game: React.FC = () => {
  const { publicKey } = useWallet();
  const {
    gameState,
    isStaked,
    handleTargetClick,
    stakeSOL,
    connectToGame
  } = useGameState();

  useEffect(() => {
    connectToGame();
  }, [connectToGame]);

  const isSpectator = !isStaked && publicKey;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            Solana Reflex Battle
          </h1>
          <p className="text-lg text-gray-300">
            {isSpectator ? 'Stake SOL to join the game!' : 'Click the target faster than others to win!'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center">
                <GameStats 
                  playerCount={gameState.players.length}
                  timeLeft={Math.max(0, (gameState.currentRoundEndTime - Date.now()) / 1000)}
                />
                <WalletMultiButton />
              </div>
            </div>

            <div className="relative aspect-[16/9] bg-gray-900/50 backdrop-blur-md rounded-xl overflow-hidden">
              {publicKey ? (
                isStaked ? (
                  <Target 
                    position={gameState.targetPosition} 
                    onClick={handleTargetClick}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                    <button
                      onClick={() => stakeSOL(0.1)}
                      className="px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Stake 0.1 SOL to Play
                    </button>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-semibold">Connect your wallet to play</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <StakedPlayers players={gameState.players} />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="https://twitter.com/intent/tweet?text=I'm playing Solana Reflex Battle!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] rounded-lg hover:opacity-90 transition-opacity"
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