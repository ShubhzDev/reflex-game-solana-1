import { Idl } from '@coral-xyz/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import gameIdl from '../idl/game.json';

export const GAME_PHASES = {
  STAKING: 'STAKING',
  GAMEPLAY: 'GAMEPLAY',
  WINNER_DECLARATION: 'WINNER_DECLARATION'
} as const;

export const GAME_CONFIG = {
  BACKEND_URL: 'http://localhost:3000',
  PROGRAM_ID: 'B1NT1eXqBEnidk3kQ874u1h7VvyqBxTc9qfspgh1ef8A',
  IDL: gameIdl as Idl,
  STAKE_AMOUNT: 0.1 * LAMPORTS_PER_SOL,
  RENT_AMOUNT: 0.02 * LAMPORTS_PER_SOL, // Minimum rent for player account
  MIN_STAKE_TOTAL: 0.12 * LAMPORTS_PER_SOL, // STAKE_AMOUNT + RENT_AMOUNT
  REWARD_PERCENTAGE: 0.9,
  PHASES: {
    STAKING: 30000,      // 30 seconds
    GAMEPLAY: 30000,     // 30 seconds
    WINNER: 10000        // 10 seconds
  },
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