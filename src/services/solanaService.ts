import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import idl from '../../my-staking/target/idl/staking_program.json'; // Your IDL file generated after building the program
import type { StakingProgram } from '../../my-staking/target/types/staking_program'; // Adjust path as necessary

const PROGRAM_ID = new PublicKey('B1NT1eXqBEnidk3kQ874u1h7VvyqBxTc9qfspgh1ef8A');
const TREASURY_WALLET = new PublicKey('CMLp3zJRmqvv8PufYCniesemKTD3BVvqS6LRoDZMWr2U');

export class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(connection: Connection, wallet: any) {
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    this.program = new Program(idl as StakingProgram as Idl,this.provider);
  }

  async initializeGame() {

    if (!this.program.provider.publicKey) {
      throw new Error('Wallet public key is undefined. Ensure the wallet is connected.');
    }

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('state')],
      PROGRAM_ID
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault')],
      PROGRAM_ID
    );

    await this.program.methods
      .initialize(TREASURY_WALLET)
      .accounts({
        authority: this.program.provider.publicKey,
        state: statePda,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async stake(amount: number) {

    if (!this.program.provider.publicKey) {
      throw new Error('Wallet public key is undefined. Ensure the wallet is connected.');
    }

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('state')],
      PROGRAM_ID
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault')],
      PROGRAM_ID
    );

    const [playerPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('player'),
        this.program.provider.publicKey.toBuffer(),
      ],
      PROGRAM_ID
    );

    await this.program.methods
      .stake(new BN(amount))
      .accounts({
        authority: this.program.provider.publicKey,
        state: statePda,
        vault: vaultPda,
        playerAccount: playerPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async distributeRewards(winner: PublicKey) {

    if (!this.program.provider.publicKey) {
      throw new Error('Wallet public key is undefined. Ensure the wallet is connected.');
    }

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('state')],
      PROGRAM_ID
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault')],
      PROGRAM_ID
    );

    await this.program.methods
      .reward()
      .accounts({
        authority: this.program.provider.publicKey,
        state: statePda,
        vault: vaultPda,
        treasury: TREASURY_WALLET,
        winner,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
}