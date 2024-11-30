import Player from '../models/Player';
import { IPlayer } from '../types';

export const stakeSOL = async (wallet: string, amount: number): Promise<IPlayer | null> => {
  try {
    const player = await Player.findOneAndUpdate(
      { wallet },
      { 
        $inc: { stakedAmount: amount },
        lastActive: new Date(),
      },
      { upsert: true, new: true }
    );
    return player;
  } catch (error) {
    console.error('Error staking SOL:', error);
    return null;
  }
};

export const getActivePlayers = async (): Promise<IPlayer[]> => {
  try {
    return Player.find({
      lastActive: { $gte: new Date(Date.now() - 30000) },
      stakedAmount: { $gt: 0 },
    });
  } catch (error) {
    console.error('Error getting active players:', error);
    return [];
  }
};