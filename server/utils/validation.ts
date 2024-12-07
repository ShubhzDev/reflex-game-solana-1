import { PublicKey } from '@solana/web3.js';

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const isValidStakeAmount = (amount: number): boolean => {
  return amount > 0 && Number.isFinite(amount);
};