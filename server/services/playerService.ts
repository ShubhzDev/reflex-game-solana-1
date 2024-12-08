import Player from '../models/Player';
import { IPlayerData } from '../types';
import { solanaService } from './solanaService';

export const stakeSOL = async (wallet: string, amount: number): Promise<IPlayerData | null> => {
  try {
    // Verify the stake on-chain
    const isVerified = await solanaService.verifyStake(wallet, amount);
    if (!isVerified) {
      throw new Error('Stake verification failed');
    }

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
    throw error;
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