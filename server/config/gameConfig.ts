export const GAME_PHASES = {
    STAKING: 'STAKING',
    GAMEPLAY: 'GAMEPLAY',
    WINNER_DECLARATION: 'WINNER_DECLARATION'
  } as const;
  
  export type GamePhase = typeof GAME_PHASES[keyof typeof GAME_PHASES];