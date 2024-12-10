import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { GAME_CONFIG } from '../config/constants';
import { createAnchorProvider, createProgram } from '../config/anchor';
import { StakeTransaction } from './transactions/StakeTransaction';
import { SolanaTransactionError, SolanaConnectionError, SolanaConfigError } from './errors/SolanaErrors';
import * as anchor from "@coral-xyz/anchor";

export class SolanaService {
  private connection: Connection;
  private wallet: WalletContextState;
  private program: Program;
  private stakeTransaction: StakeTransaction;

  constructor(connection: Connection, wallet: WalletContextState) {
    if (!connection) throw new SolanaConfigError('Connection is required');
    if (!wallet) throw new SolanaConfigError('Wallet is required');

    this.connection = connection;
    this.wallet = wallet;
    
    const provider = createAnchorProvider(connection, wallet as any);
    this.program = createProgram(provider);
    this.stakeTransaction = new StakeTransaction(this.program);
  }

  async stake(amount: number): Promise<string> {
    if (!this.wallet.publicKey) {
      throw new SolanaConfigError('Wallet not connected');
    }

    try {
      // Check wallet balance
      const balance = await this.connection.getBalance(this.wallet.publicKey);
      const requiredAmount = GAME_CONFIG.MIN_STAKE_TOTAL;
      
      if (balance < requiredAmount) {
        throw new SolanaTransactionError(
          `Insufficient balance. Need ${requiredAmount / LAMPORTS_PER_SOL} SOL (includes rent)`
        );
      }

      // Build the transaction with stake amount + rent
      const tx = await this.stakeTransaction.build(
        this.wallet.publicKey,
        new anchor.BN(requiredAmount)
      );

      // Get latest blockhash
      const latestBlockhash = await this.connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = this.wallet.publicKey;

      // Sign and send transaction
      const signedTx = await this.signTransaction(tx);
      const signature = await this.sendAndConfirmTransaction(signedTx, latestBlockhash);

      return signature;
    } catch (error) {
      console.error('Stake error:', error);
      throw this.handleTransactionError(error);
    }
  }

  private async signTransaction(transaction: Transaction): Promise<Transaction> {
    const signedTx = await this.wallet.signTransaction?.(transaction);
    if (!signedTx) {
      throw new SolanaConnectionError('Failed to sign transaction');
    }
    return signedTx;
  }

  private async sendAndConfirmTransaction(
    signedTx: Transaction,
    latestBlockhash: { blockhash: string; lastValidBlockHeight: number }
  ): Promise<string> {
    try {
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      
      await this.connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });

      return signature;
    } catch (error) {
      throw new SolanaConnectionError('Failed to send or confirm transaction');
    }
  }

  private handleTransactionError(error: unknown): Error {
    console.error('Transaction error details:', error);

    if (error instanceof SolanaTransactionError || 
        error instanceof SolanaConnectionError || 
        error instanceof SolanaConfigError) {
      return error;
    }

    if ((error as any).logs) {
      return SolanaTransactionError.fromSendTransactionError(error as any);
    }

    return new SolanaTransactionError('Transaction failed. Please try again.');
  }
}