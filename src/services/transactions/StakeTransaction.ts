import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import * as anchor from "@coral-xyz/anchor";
const { BN } = anchor;

export class StakeTransaction {
  constructor(private program: Program) {}

  async build(
    wallet: PublicKey,
    lamports: BN
  ): Promise<Transaction> {
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