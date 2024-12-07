import { Idl } from '@coral-xyz/anchor';
import gameIdl from '../../src/idl/game.json';

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/solana-reflex',
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
};

export const GAME_CONFIG = {
  PROGRAM_ID: 'B1NT1eXqBEnidk3kQ874u1h7VvyqBxTc9qfspgh1ef8A',
  IDL: gameIdl as Idl,
  MIN_STAKE_AMOUNT: 0.1,
  REWARD_PERCENTAGE: 0.9,
};

export const GAME_PHASES = {
  STAKING: 'STAKING',
  GAMEPLAY: 'GAMEPLAY',
  WINNER_DECLARATION: 'WINNER_DECLARATION'
} as const;

export const PHASE_DURATIONS = {
  [GAME_PHASES.STAKING]: 30000,    // 30 seconds
  [GAME_PHASES.GAMEPLAY]: 30000,    // 30 seconds
  [GAME_PHASES.WINNER_DECLARATION]: 10000, // 10 seconds
} as const;