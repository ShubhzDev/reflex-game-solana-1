import mongoose, { Schema } from 'mongoose';
import { IPlayer } from '../types';

const playerSchema = new Schema<IPlayer>({
  wallet: {
    type: String,
    required: true,
    unique: true,
  },
  stakedAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPlayer>('Player', playerSchema);