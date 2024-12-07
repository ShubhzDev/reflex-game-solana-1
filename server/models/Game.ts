import mongoose, { Schema } from 'mongoose';
import { IGame } from '../types';
import { GAME_PHASES } from '../config/gameConfig';

const gameSchema = new Schema<IGame>({
  targetPosition: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  roundEndTime: {
    type: Date,
    required: true,
  },
  currentRound: {
    type: Number,
    default: 1,
  },
  currentPhase: {
    type: String,
    enum: Object.values(GAME_PHASES),
    default: GAME_PHASES.STAKING,
  },
  phaseStartTime: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model<IGame>('Game', gameSchema);