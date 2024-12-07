import Game from '../models/Game';
import Player from '../models/Player';
import { generateNewPosition } from '../utils/gameUtils';
import { GAME_PHASES } from '../config/gameConfig';

export const createNewRound = async () => {
  try {
    // Reset all player scores
    await Player.updateMany({}, { $set: { score: 0 } });

    // Create or update game state
    const game = await Game.findOne();
    if (game) {
      game.targetPosition = generateNewPosition();
      game.roundEndTime = new Date(Date.now() + 30000); // 30 seconds per round
      game.currentPhase = GAME_PHASES.STAKING;
      game.phaseStartTime = new Date();
      await game.save();
    } else {
      await Game.create({
        targetPosition: generateNewPosition(),
        isActive: true,
        roundEndTime: new Date(Date.now() + 30000),
        currentRound: 1,
        currentPhase: GAME_PHASES.STAKING,
        phaseStartTime: new Date()
      });
    }
  } catch (error) {
    console.error('Error creating new round:', error);
    throw error;
  }
};