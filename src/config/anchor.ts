import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection } from '@solana/web3.js';
import { GAME_CONFIG } from './constants';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const createAnchorProvider = (connection: Connection, wallet: WalletContextState) => {
  return new AnchorProvider(
    connection,
    wallet as any,
    { commitment: 'processed' }
  );
};

export const createProgram = (provider: AnchorProvider) => {
  return new Program(
    GAME_CONFIG.IDL,
    provider
  );
};