import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { GAME_CONFIG } from '../config/constants';
import { StakeTransaction } from './transactions/StakeTransaction';
import { SolanaTransactionError, SolanaConnectionError, SolanaConfigError } from './errors/SolanaErrors';
import * as anchor from "@coral-xyz/anchor";
const { BN } = anchor;

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
    
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'processed' }
    );

    this.program = new Program(
      GAME_CONFIG.IDL,
      provider
    );

    this.stakeTransaction = new StakeTransaction(this.program);
  }

  async stake(amount: number): Promise<string> {
    if (!this.wallet.publicKey) {
      throw new SolanaConfigError('Wallet not connected');
    }

    try {
      const lamports = new BN(amount * LAMPORTS_PER_SOL);
      
      // Build the transaction
      const tx = await this.stakeTransaction.build(
        this.wallet.publicKey,
        lamports
      );

      // Get latest blockhash
      const latestBlockhash = await this.connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = this.wallet.publicKey;

      // Sign transaction
      const signedTx = await this.signTransaction(tx);

      // Send and confirm transaction
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

    // Handle SendTransactionError specifically
    if ((error as any).logs) {
      return SolanaTransactionError.fromSendTransactionError(error as any);
    }

    return new SolanaTransactionError('Transaction failed. Please try again.');
  }
}