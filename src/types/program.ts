import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

export interface PlayerAccount {
  key: PublicKey;
  amount: number;
}

export interface ProgramState {
  owner: PublicKey;
  treasuryAccount: PublicKey;
  totalStaked: number;
  playerCount: number;
}

export interface StakingProgram extends Program<Idl> {
  account: {
    playerAccount: {
      fetch(address: PublicKey): Promise<PlayerAccount>;
    };
    state: {
      fetch(address: PublicKey): Promise<ProgramState>;
    };
  };
}

export interface ProgramError extends Error {
  code?: number;
  msg?: string;
}