import React from 'react';
import { Player } from '../types';
import { formatWalletAddress } from '../utils/format';

interface StakedPlayersProps {
  players: Player[];
}

export const StakedPlayers: React.FC<StakedPlayersProps> = ({ players }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
        Staked Players
      </h2>
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {players.map((player, index) => (
          <div 
            key={player.wallet} 
            className="bg-black/20 rounded-lg p-3 flex justify-between items-center"
          >
            <span className="text-cyan-300">{formatWalletAddress(player.wallet)}</span>
            <span className="font-mono text-pink-300">{player.stakedAmount} SOL</span>
          </div>
        ))}
      </div>
    </div>
  );
};