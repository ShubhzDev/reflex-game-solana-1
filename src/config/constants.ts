import { Idl } from '@coral-xyz/anchor';
import gameIdl from '../idl/game.json';

export const GAME_PHASES = {
  STAKING: 'STAKING',
  GAMEPLAY: 'GAMEPLAY',
  WINNER_DECLARATION: 'WINNER_DECLARATION'
} as const;

export const GAME_CONFIG = {
  BACKEND_URL: 'http://localhost:3000',
  PHASES: {
    STAKING: 4 * 60 * 1000,    // 4 minutes
    GAMEPLAY: 4 * 60 * 1000,   // 4 minutes
    WINNER: 2 * 60 * 1000      // 2 minutes
  },
  ROUND_DURATION: 10 * 60 * 1000, // 10 minutes
  TARGET_UPDATE_INTERVAL: 500,     // 500ms for faster target movement
  STAKE_AMOUNT: 0.1,
  PROGRAM_ID: 'B1NT1eXqBEnidk3kQ874u1h7VvyqBxTc9qfspgh1ef8A',
  IDL: gameIdl as Idl,
  REWARD_PERCENTAGE: 0.9,
};

export const LEGAL_DISCLAIMER = `
  This game involves virtual currency transactions and skill-based gameplay. 
  Participation constitutes acceptance of all risks. 
  Not available where prohibited by law. 
  Players must be of legal age in their jurisdiction. 
  Virtual currency has no real-world value. 
  Game outcomes depend on player skill and timing.
  No real-money gambling is involved.
`;