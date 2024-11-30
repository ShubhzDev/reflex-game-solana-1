import React from 'react';
import { Player } from '../types';
import { formatWalletAddress } from '../utils/format';

interface StakedPlayersProps {
  players: Player[];
}

export const StakedPlayers: React.FC<StakedPlayersProps> = ({ players }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Staked Players</h2>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
            <span className="text-gray-300">{formatWalletAddress(player.wallet)}</span>
            <span className="font-mono">{player.stakedAmount} SOL</span>
          </div>
        ))}
      </div>
    </div>
  );
};