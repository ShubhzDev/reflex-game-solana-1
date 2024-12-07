import Player from '../models/Player';
import { IPlayer, IPlayerData } from '../types';

export const stakeSOL = async (wallet: string, amount: number): Promise<IPlayerData | null> => {
  try {
    const player = await Player.findOneAndUpdate(
      { wallet },
      { 
        $inc: { stakedAmount: amount },
        lastActive: new Date(),
      },
      { upsert: true, new: true }
    );
    
    if (!player) return null;
    
    return {
      wallet: player.wallet,
      stakedAmount: player.stakedAmount,
      score: player.score,
      lastActive: player.lastActive
    };
  } catch (error) {
    console.error('Error staking SOL:', error);
    return null;
  }
};

export const getActivePlayers = async (): Promise<IPlayerData[]> => {
  try {
    const players = await Player.find({
      lastActive: { $gte: new Date(Date.now() - 30000) },
      stakedAmount: { $gt: 0 },
    });

    return players.map(player => ({
      wallet: player.wallet,
      stakedAmount: player.stakedAmount,
      score: player.score,
      lastActive: player.lastActive
    }));
  } catch (error) {
    console.error('Error getting active players:', error);
    return [];
  }
};