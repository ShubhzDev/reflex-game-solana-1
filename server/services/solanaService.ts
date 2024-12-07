import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, BN } from '@coral-xyz/anchor';
import { GAME_CONFIG } from '../config/constants';
import * as anchor from '@coral-xyz/anchor';
import dotenv from 'dotenv';

dotenv.config();

export class SolanaService {
  private connection: Connection;
  private program: Program;
  private provider: AnchorProvider;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899', 'confirmed');
    
    // Load program authority keypair from env
    const authorityKeypair = Keypair.fromSecretKey(
      Buffer.from(JSON.parse(process.env.AUTHORITY_KEYPAIR || '[]'))
    );
    
    const wallet = new Wallet(authorityKeypair);
    
    this.provider = new AnchorProvider(
      this.connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    this.program = new Program(
      GAME_CONFIG.IDL,
      new PublicKey(GAME_CONFIG.PROGRAM_ID),
      this.provider
    );
  }

  async distributeRewards(winners: { wallet: string; amount: number }[]): Promise<string[]> {
    const signatures: string[] = [];

    try {
      const [statePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('state')],
        this.program.programId
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault')],
        this.program.programId
      );

      for (const winner of winners) {
        try {
          const winnerPubkey = new PublicKey(winner.wallet);
          const lamports = new BN(winner.amount * LAMPORTS_PER_SOL);

          const tx = await this.program.methods
            .reward(winnerPubkey)
            .accounts({
              authority: this.provider.wallet.publicKey,
              state: statePda,
              vault: vaultPda,
              treasury: new PublicKey(process.env.TREASURY_WALLET!),
              winner: winnerPubkey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

          signatures.push(tx);
        } catch (error) {
          console.error(`Error distributing rewards to ${winner.wallet}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in distributeRewards:', error);
    }

    return signatures;
  }

  async verifyStake(wallet: string, amount: number): Promise<boolean> {
    try {
      const walletPubkey = new PublicKey(wallet);
      const [playerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('player'), walletPubkey.toBuffer()],
        this.program.programId
      );

      const playerAccount = await this.program.account.playerAccount.fetch(playerPda);
      return playerAccount.amount.toNumber() / LAMPORTS_PER_SOL >= amount;
    } catch (error) {
      console.error('Error verifying stake:', error);
      return false;
    }
  }

  async getTotalStaked(): Promise<number> {
    try {
      const [statePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('state')],
        this.program.programId
      );

      const state = await this.program.account.state.fetch(statePda);
      return state.totalStaked.toNumber() / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting total staked:', error);
      return 0;
    }
  }
}

export const solanaService = new SolanaService();