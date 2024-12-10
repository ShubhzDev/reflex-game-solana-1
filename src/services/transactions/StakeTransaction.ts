import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { GAME_CONFIG } from '../../config/constants';
import * as anchor from "@coral-xyz/anchor";

export class StakeTransaction {
  constructor(private program: Program) {}

  async build(
    wallet: PublicKey,
    lamports: anchor.BN
  ): Promise<Transaction> {
    // Ensure minimum stake amount includes rent
    if (lamports.toNumber() < GAME_CONFIG.MIN_STAKE_TOTAL) {
      throw new Error(`Minimum stake amount must be ${GAME_CONFIG.MIN_STAKE_TOTAL / LAMPORTS_PER_SOL} SOL to cover rent`);
    }

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('state')],
      this.program.programId
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault')],
      this.program.programId
    );

    const [playerPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('player'),
        wallet.toBuffer(),
      ],
      this.program.programId
    );

    return await this.program.methods
      .stake(lamports)
      .accounts({
        authority: wallet,
        state: statePda,
        vault: vaultPda,
        playerAccount: playerPda,
        systemProgram: SystemProgram.programId,
      })
      .transaction();
  }
}