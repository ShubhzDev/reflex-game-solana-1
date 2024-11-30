import Game from '../models/Game';
import Player from '../models/Player';
import { Position, Winner } from '../types';

const ROUND_DURATION = 30000; // 30 seconds
const REWARD_PERCENTAGE = 0.9; // 90% of the pool goes to winners

export const generateNewPosition = (): Position => ({
  x: Math.floor(Math.random() * 80 + 10),
  y: Math.floor(Math.random() * 80 + 10),
});

export const calculateRewards = async (currentRound: number): Promise<Winner[]> => {
  try {
    const players = await Player.find({ 
      lastActive: { $gte: new Date(Date.now() - ROUND_DURATION) },
      score: { $gt: 0 }
    }).sort({ score: -1 });

    if (players.length === 0) return [];

    const totalStaked = players.reduce((sum, p) => sum + p.stakedAmount, 0);
    const prizePool = totalStaked * REWARD_PERCENTAGE;
    
    const rewardDistribution = [0.5, 0.3, 0.2];
    const winners = players.slice(0, 3).map((player, index) => ({
      wallet: player.wallet,
      amount: prizePool * rewardDistribution[index],
      round: currentRound,
    }));

    return winners;
  } catch (error) {
    console.error('Error calculating rewards:', error);
    return [];
  }
};

export const createNewRound = async (): Promise<Winner[]> => {
  try {
    const game = await Game.findOne();
    if (game) {
      const winners = await calculateRewards(game.currentRound);
      game.targetPosition = generateNewPosition();
      game.roundEndTime = new Date(Date.now() + ROUND_DURATION);
      game.currentRound += 1;
      await game.save();
      return winners;
    } else {
      await Game.create({
        targetPosition: generateNewPosition(),
        roundEndTime: new Date(Date.now() + ROUND_DURATION),
      });
      return [];
    }
  } catch (error) {
    console.error('Error creating new round:', error);
    return [];
  }
};

export const handlePlayerClick = async (wallet: string, timestamp: number) => {
  try {
    const player = await Player.findOne({ wallet });
    if (!player || player.stakedAmount <= 0) return null;

    const game = await Game.findOne();
    if (!game || !game.isActive) return null;

    player.score += 1;
    player.lastActive = new Date();
    await player.save();

    return player;
  } catch (error) {
    console.error('Error handling player click:', error);
    return null;
  }
};

export const getGameState = async () => {
  try {
    const [game, players] = await Promise.all([
      Game.findOne(),
      Player.find({ 
        lastActive: { $gte: new Date(Date.now() - ROUND_DURATION) },
        stakedAmount: { $gt: 0 }
      }),
    ]);

    if (!game) return null;

    const totalStaked = players.reduce((sum, p) => sum + p.stakedAmount, 0);

    return {
      targetPosition: game.targetPosition,
      players: players.map(p => ({
        wallet: p.wallet,
        stakedAmount: p.stakedAmount,
        score: p.score,
      })),
      isActive: game.isActive,
      currentRoundEndTime: game.roundEndTime.getTime(),
      winners: [],
      prizePool: totalStaked * REWARD_PERCENTAGE,
    };
  } catch (error) {
    console.error('Error getting game state:', error);
    return null;
  }
};