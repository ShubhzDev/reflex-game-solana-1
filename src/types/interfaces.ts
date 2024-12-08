import { GAME_PHASES } from '../../server/config/constants';

export interface IGame {
  targetPosition: {
    x: number;
    y: number;
  };
  isActive: boolean;
  roundEndTime: Date;
  currentRound: number;
  currentPhase: keyof typeof GAME_PHASES;
  phaseStartTime: Date;
}

export interface IPlayer {
  wallet: string;
  stakedAmount: number;
  score: number;
  lastActive: Date;
}

export interface IPlayerData {
  wallet: string;
  stakedAmount: number;
  score: number;
  lastActive: Date;
}