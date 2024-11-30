import mongoose, { Schema } from 'mongoose';
import { IGame } from '../types';

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
});

export default mongoose.model<IGame>('Game', gameSchema);