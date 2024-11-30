import { Document } from 'mongoose';

export interface Position {
  x: number;
  y: number;
}

export interface IGame extends Document {
  targetPosition: Position;
  isActive: boolean;
  roundEndTime: Date;
  currentRound: number;
}

export interface IPlayer extends Document {
  wallet: string;
  stakedAmount: number;
  score: number;
  lastActive: Date;
}

export interface Winner {
  wallet: string;
  amount: number;
  round: number;
}

export interface GameState {
  targetPosition: Position;
  players: Array<{
    wallet: string;
    stakedAmount: number;
    score: number;
  }>;
  isActive: boolean;
  currentRoundEndTime: number;
  winners: Winner[];
  prizePool: number;
}