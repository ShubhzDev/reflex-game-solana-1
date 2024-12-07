import { GAME_PHASES } from '../config/constants';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  wallet: string;
  stakedAmount: number;
  score: number;
}

export interface Winner {
  wallet: string;
  amount: number;
  round: number;
}

export type GamePhase = typeof GAME_PHASES[keyof typeof GAME_PHASES];

export interface GameState {
  targetPosition: Position;
  players: Player[];
  isActive: boolean;
  currentRoundEndTime: number;
  winners: Winner[];
  prizePool: number;
  serverTime: number;
  currentPhase: GamePhase;
  phaseEndTime: number;
}