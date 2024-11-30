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

export interface GameState {
  targetPosition: Position;
  players: Player[];
  isActive: boolean;
  currentRoundEndTime: number;
  winners: Winner[];
  prizePool: number;
}